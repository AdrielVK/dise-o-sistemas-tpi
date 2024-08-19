
from django.contrib import admin
from django.urls import path, re_path, include
from django.shortcuts import render
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView


def index_view(request):
    return render(request, 'dist/index.html')


urlpatterns = [
    path('user/', include('cu.user.urls')),
    path('admin/', admin.site.urls),
    path('realizar_pago/', include('cu.realizar_pago.urls'))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='dist/index.html'))]