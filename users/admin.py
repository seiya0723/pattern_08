from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import CustomUser


#TODO:settings.pyに書いてあるDEFAULT_FROM_EMAILを参照するため、settings.pyをimport
from django.conf import settings
from django.core.mail import send_mail


class CustomUserAdmin(UserAdmin):

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    #管理サイトから追加するときのフォーム
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', "email", 'password1', 'password2'),
        }),
    )

    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email')

    #TODO:ここにカスタムアクションを作る。
    #参照元:https://noauto-nolife.com/post/django-admin-custom-action/
    actions = [ "campaign_mail" ]

    #このusersという引数はモデルオブジェクトのリスト
    def campaign_mail(self, request, users):
        for user in users:
            print(user.email)

            subject = "キャンペーンメールです【A-Shop】"
            message = "いつもご利用いただいているお客様に、全商品10パーセントOFFのクーポンを送ります。"

            #運営からのメールであれば、このようにsettings.pyに書いてあるDEFAULT_FROM_EMAILを読み取り、セットする。
            #ユーザー間の送信であれば、ユーザーモデルからメールアドレスを参照する。
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [ user.email ]

            send_mail(subject, message, from_email, recipient_list)

    campaign_mail.short_description   = "選択したユーザーにキャンペーンメール(定型文)を送る"

    #Q:配送のメール送信はどうするべきか？
    #A:今回のカスタムアクションで実装するのではなく、フォームクラスのsaveメソッドをオーバーライドして、DBにデータが保存された時にメールを送信する。
    #→つまり、注文未処理テーブルから配送中テーブルにデータをコピーして保存する時、配送開始メールを送る。これで、注文を配送中に切り替える処理をしたと同時に、メールが送信されるため、漏れがなくなる。
    #saveメソッド書き換えの参照元:https://noauto-nolife.com/post/django-models-save-delete-override/


admin.site.register(CustomUser, CustomUserAdmin)
