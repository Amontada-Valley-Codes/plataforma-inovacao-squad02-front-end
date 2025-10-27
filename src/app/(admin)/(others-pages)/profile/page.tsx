"use client";
import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Shield, Edit2, Save, X, Loader2, Camera } from "lucide-react";
import api from "@/services/axiosServices";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type UserProfile = {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  picture: string | null;
  company: {
    name: string;
  };
};

const roleTranslations: { [key: string]: string } = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  USER: "Usuário",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
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
      const response = await api.get("/users/me");
      const userData = response.data;
      console.log("Dados do usuário:", userData);
      setProfile(userData);
      
      // A API retorna pictures (plural) como objeto {url, public_id}
      const hasImage = userData.pictures?.url && userData.pictures.url !== "none";
      setImagePreview(hasImage ? userData.pictures.url : null);
      
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
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
    setImageFile(null);
    
    const hasImage = profile?.picture && profile.picture !== "none";
    setImagePreview(hasImage ? profile.picture : null);
    
    reset({
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone || "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Imagem muito grande. Máximo 5MB.", "error");
      e.target.value = "";
      return;
    }

    // Validar tipo - aceitar apenas formatos comuns
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showNotification("Formato inválido. Use JPG, PNG, GIF ou WebP.", "error");
      e.target.value = "";
      return;
    }

    console.log("Arquivo selecionado:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setError(null);
    
    try {
      // Criar FormData para enviar tudo junto
      const formData = new FormData();
      
      // Adicionar dados do formulário
      formData.append("name", data.name);
      formData.append("email", data.email);
      
      if (data.phone && data.phone.trim() !== "") {
        formData.append("phone", data.phone);
      }

      if (data.password && data.password.trim() !== "") {
        formData.append("password", data.password);
      }

      // Se houver imagem, adicionar ao FormData
      if (imageFile) {
        formData.append("newImage", imageFile, imageFile.name);
        
        console.log("Enviando com imagem:", {
          fileName: imageFile.name,
          fileSize: imageFile.size,
          fileType: imageFile.type
        });
      }

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? `File: ${(pair[1] as File).name}` : pair[1]);
      }

      // Enviar requisição com FormData
      const response = await api.put("/users/me", formData);

      console.log("Resposta da API:", response.data);

      const updatedData = response.data;
      setProfile(updatedData);
      
      // Atualizar preview com a URL retornada pela API
      const hasImage = updatedData.picture && updatedData.picture !== "none";
      setImagePreview(hasImage ? updatedData.picture : null);
      
      setImageFile(null);
      setIsEditing(false);
      
      Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Recarregar perfil para garantir dados atualizados
      await fetchProfile();
      
    } catch (error: any) {
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
      
      let errorMessage = "Erro ao atualizar perfil. Tente novamente.";
      
      if (error.response?.data) {
        // Tentar extrair a mensagem de erro de diferentes formatos
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors) {
          // Se for um array de erros
          errorMessage = Array.isArray(error.response.data.errors) 
            ? error.response.data.errors.join(', ')
            : JSON.stringify(error.response.data.errors);
        }
      }
      
      setError(errorMessage);
      showNotification(errorMessage, "error");
      
      Swal.fire({
        title: "Erro!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md w-full mx-4">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          <Button onClick={fetchProfile} className="w-full mt-4" >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md w-full mx-4">
          <p className="text-red-600 dark:text-red-400 text-center">Perfil não encontrado</p>
          <Button onClick={fetchProfile} className="w-full mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = !profile.phone;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Notificação */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm sm:text-xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-400 text-sm sm:text-base">
                    Complete seu perfil
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-500">
                    Adicione seu telefone para ter acesso completo
                  </p>
                </div>
              </div>
              <Button onClick={handleEdit} size="sm" className="sm:ml-auto mt-2 sm:mt-0">
                Completar Agora
              </Button>
            </div>
          </div>
        )}

        {/* Header com Imagem */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-700 dark:to-amber-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-white/30">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Erro ao carregar imagem:", imagePreview);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 sm:w-12 sm:h-12 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">{profile.name}</h1>
                <p className="text-orange-100 dark:text-orange-200 font-medium text-sm sm:text-base">
                  {roleTranslations[profile.role] || profile.role}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                className="bg-white hover:bg-orange-50 dark:bg-gray-800 text-orange-600 dark:text-orange-400 dark:hover:bg-gray-700 mt-4 sm:mt-0 w-full sm:w-auto justify-center"
                size="sm"
              >
                <Edit2 size={18}/>
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        {/* Formulário de Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-orange-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 justify-center sm:justify-start">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            Informações Pessoais
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Nome */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Nome Completo *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="text"
                      {...register("name")}
                      placeholder="Digite seu nome completo"
                      className="text-base sm:text-lg w-full"
                    />
                    {errors.name && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.name.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">{profile.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  E-mail *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Digite seu e-mail"
                      className="text-base sm:text-lg w-full"
                    />
                    {errors.email && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.email.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Telefone */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Telefone
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      type="tel"
                      {...register("phone")}
                      placeholder="+55 11 99999-9999"
                      className="text-base sm:text-lg w-full"
                    />
                    {errors.phone && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.phone.message}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {profile.phone || (
                      <span className="text-gray-400 dark:text-gray-500 italic">Não informado</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Senha */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Nova Senha (opcional)
                  </Label>
                  <div>
                    <Input
                      type="password"
                      {...register("password")}
                      placeholder="Deixe em branco para manter a atual"
                      className="text-base sm:text-lg w-full"
                    />
                    {errors.password && (
                      <span className="text-red-600 text-sm mt-1 block">{errors.password.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cargo/Role */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Cargo
                </Label>
                <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                  {roleTranslations[profile.role] || profile.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Nível de acesso: <span className="font-semibold">{profile.role}</span>
                </p>
              </div>
            </div>

            {/* Empresa */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Empresa
                </Label>
                {profile.company?.name ? (
                  <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {profile.company.name}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">Não vinculado a nenhuma empresa</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
              <Button
                onClick={handleCancel}
                className="flex-1 order-2 sm:order-1"
                size="sm"
              >
                <X size={18} />
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 order-1 sm:order-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                size="sm"
                disabled={saving}
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
        {isEditing && (
          <div className="mt-6 bg-orange-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 justify-center sm:justify-start">
              <Camera className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                Formatos aceitos: JPG, PNG, GIF, WebP
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-orange-400">•</span>
                Mantenha suas informações de contato atualizadas
              </li>
            </ul>
          </div>
        )}

        {/* Mensagem de erro geral */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
            <p className="text-red-600 dark:text-red-400 text-center text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}