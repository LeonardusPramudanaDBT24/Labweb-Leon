# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import Loginform
from .models import Mahasiswa, Profile

def login_view(request):
    if request.user.is_authenticated:
        return redirect("accounts:dashboard")

    form = Loginform(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = authenticate(
            request,
            username=form.cleaned_data["username"],
            password=form.cleaned_data["password"],
        )
        if user:
            login(request, user)
            messages.success(request, "Berhasil masuk.")
            return redirect("accounts:dashboard")
        messages.error(request, "Username atau password salah.")
    return render(request, "accounts/login.html", {"form": form})

def logout_view(request):
    logout(request)
    messages.info(request, "Anda telah logout.")
    return redirect("accounts:login")

@login_required
def dashboard(request):
    # role-based UI rendering
    role = getattr(getattr(request.user, "profile", None), "role", "MAHASISWA")
    return render(request, "accounts/dashboard.html", {"role": role})

# ---- contoh halaman khusus dosen ----
def is_dosen(user):
    return hasattr(user, "profile") and user.profile.role == "DOSEN"

@user_passes_test(is_dosen, login_url="accounts:login")
def dosen_only_view(request):
    mahasiswa_list = Mahasiswa.objects.all()

    data_mahasiswa = []
    for mhs in mahasiswa_list:
        data_mahasiswa.append({
            "user": mhs.user,
            "nilai": mhs.nilai,
        })

    return render(request, "accounts/dosen_only.html", {
        "mahasiswa_list": mahasiswa_list
    })