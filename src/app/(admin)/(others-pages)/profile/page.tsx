"use client";
import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Shield, Edit2, Save, X, Loader2, Camera, Upload } from "lucide-react";
import api from "@/services/axiosServices";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional().refine(
    (val) => !val || val.length >= 10,
    "Telefone deve ter pelo menos 10 dígitos"
  ),
  companyId: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  companyId?: string;
  profileImage?: string;
};

const roleTranslations: { [key: string]: string } = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  USER: "Usuário",
  EMPLOYEE: "Funcionário",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(userData);
      setProfileImage(userData.profileImage || null);
      setImagePreview(userData.profileImage || null);
      
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        companyId: userData.companyId || "",
      });
    } catch (error) {
      console.error("Erro ao buscar perfil", error);
      setError("Erro ao carregar perfil do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: string = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(profileImage);
    reset({
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone || "",
      companyId: profile?.companyId || "",
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Imagem muito grande. Máximo 5MB.", "error");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      showNotification("Apenas imagens são permitidas.", "error");
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload da imagem
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileImage(response.data.imageUrl);
      showNotification("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem", error);
      showNotification("Erro ao fazer upload da imagem.", "error");
      setImagePreview(profileImage);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const response = await api.put("/users/profile", {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        companyId: data.companyId || null,
      });

      const updatedData = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(updatedData);
      setIsEditing(false);
      showNotification("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      showNotification("Erro ao atualizar perfil. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">{error || "Perfil não encontrado"}</p>
          <Button onClick={fetchProfile} className="w-full mt-4" variant="primary">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = !profile.phone || !profile.companyId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Notificação */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 animate-pulse ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            }`}
          >
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Alerta de perfil incompleto */}
        {isProfileIncomplete && !isEditing && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                  Complete seu perfil
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-500">
                  Adicione seu telefone e outras informações para ter acesso completo
                </p>
              </div>
              <Button onClick={handleEdit} size="sm" variant="primary">
                Completar Agora
              </Button>
            </div>
          </div>
        )}

        {/* Header com Imagem */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-700 dark:to-amber-800 rounded-2xl p-8 mb-6 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                <p className="text-orange-100 dark:text-orange-200 font-medium">
                  {roleTranslations[profile.role] || profile.role}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                className="bg-white text-orange-600 hover:bg-orange-50 dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-gray-700"
                size="sm"
              >
                <Edit2 size={18} />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        {/* Formulário de Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-orange-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Informações Pessoais
          </h2>

          <div className="space-y-6">
            {/* Nome */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Nome Completo *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="text"
                      {...register("name")}
                      placeholder="Digite seu nome completo"
                      className="text-lg"
                    />
                    {errors.name && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.name.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{profile.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  E-mail *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Digite seu e-mail"
                      className="text-lg"
                    />
                    {errors.email && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.email.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Telefone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Telefone
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="tel"
                      {...register("phone")}
                      placeholder="+55 11 99999-9999"
                      className="text-lg"
                    />
                    {errors.phone && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.phone.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {profile.phone || (
                      <span className="text-gray-400 dark:text-gray-500 italic">Não informado</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Cargo/Role */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Cargo
                </Label>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {roleTranslations[profile.role] || profile.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Nível de acesso: <span className="font-semibold">{profile.role}</span>
                </p>
              </div>
            </div>

            {/* Company ID */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  ID da Empresa
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="text"
                      {...register("companyId")}
                      placeholder="Digite o ID da empresa (opcional)"
                      className="text-lg font-mono"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Caso sua empresa possua um ID específico
                    </p>
                  </div>
                ) : profile.companyId ? (
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {profile.companyId}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">Não informado</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          {isEditing && (
            <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
              <Button
                onClick={handleCancel}
                className="flex-1"
                size="sm"
                type="button"
              >
                <X size={18} />
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                size="sm"
                disabled={saving}
                type="button"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Card de Dicas */}
        <div className="mt-6 bg-orange-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Dicas para sua Foto de Perfil
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-orange-400">•</span>
              Use uma foto clara e profissional
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-orange-400">•</span>
              Tamanho máximo: 5MB
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-orange-400">•</span>
              Formatos aceitos: JPG, PNG, GIF
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-orange-400">•</span>
              Mantenha suas informações de contato atualizadas
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}