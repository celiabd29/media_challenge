"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase/supabaseClient";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMessage("❌ Lien invalide ou expiré.");
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Mot de passe mis à jour !");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Nouveau Mot de passe :
      </h1>

      <form
        onSubmit={handleReset}
        className="w-full max-w-sm bg-gray-50 rounded-xl space-y-4 mt-6"
      >
        {/* Nouveau mdp */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3">
          <LockIcon size={20} className="text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        {/* Confirm */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md mt-3 px-3">
          <LockIcon size={20} className="text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmez votre mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-gray-400"
          >
            {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        <div className="flex flex-col space-y-3 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
          >
            VALIDER
          </button>
          <a
            href="/login"
            className="w-full text-center mt-2 border-2 border-blue-500 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            ANNULER
          </a>
        </div>

        {message && (
          <p className="text-red-500 text-center font-medium mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
