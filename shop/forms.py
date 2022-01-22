from django import forms 
from .models import Pattern,PatternRecipe,Contact

class PatternForm(forms.ModelForm):

    class Meta:
        model   = Pattern
        fields  = [ "title","img","size","user" ]

class PatternRecipeForm(forms.ModelForm):

    class Meta:
        model   = PatternRecipe
        fields  = [ "target","color","number","user" ]

class ContactForm(forms.ModelForm):
    class Meta:
        model   = Contact
        fields  = [ "subject","content","ip","user","email" ]



