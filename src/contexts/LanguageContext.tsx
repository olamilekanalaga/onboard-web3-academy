import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Language {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
}

interface LanguageContextType {
  currentLanguage: string;
  languages: Language[];
  setLanguage: (languageCode: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'My Courses',
    'nav.community': 'Community',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',

    // Hero/Landing
    'hero.title': 'Master Web3.',
    'hero.build_future': 'Build Your Future.',
    'hero.subtitle': 'Join thousands of learners mastering blockchain, DeFi, and Web3 development through hands-on courses designed by industry experts.',
    'hero.cta': 'Start Learning',
    'hero.learn_more': 'Learn More',

    // Courses
    'courses.title': 'Your Learning Journey',
    'courses.subtitle': 'Progress through our comprehensive Web3 curriculum',
    'courses.start_course': 'Start Course',
    'courses.continue_course': 'Continue Course',
    'courses.view_course': 'View Course',
    'courses.locked': 'Locked',
    'courses.completed': 'Completed',
    'courses.in_progress': 'In Progress',
    'courses.take_quiz': 'Take Quiz',
    'courses.retake_quiz': 'Retake Quiz',
    'courses.quiz_required': 'Quiz Required',
    'courses.progress': 'Progress',
    'courses.chapters': 'Chapters',
    'courses.duration': 'Duration',
    'courses.difficulty': 'Difficulty',
    'courses.beginner': 'Beginner',
    'courses.intermediate': 'Intermediate',
    'courses.advanced': 'Advanced',

    // Social
    'social.title': 'Academia Community',
    'social.subtitle': 'Follow fellow students and celebrate their learning achievements together',
    'social.progress_feed': 'Progress Feed',
    'social.students': 'Students',
    'social.messages': 'Messages',
    'social.follow': 'Follow',
    'social.following': 'Following',
    'social.unfollow': 'Unfollow',
    'social.followers': 'Followers',
    'social.reactions': 'Reactions',
    'social.message': 'Message',
    'social.recent_completions': 'Recent Course Completions',
    'social.no_activity': 'No activity yet',
    'social.no_students': 'No students found',
    'social.view_profile': 'View Profile',
    'social.back_to_students': 'Back to Students',
    'social.recent_activity': 'Recent Activity',
    
    // Notifications
    'notifications.new_follower': 'New Follower',
    'notifications.reaction': 'Reaction on your post',
    'notifications.comment': 'Comment on your post',
    'notifications.course_completed': 'Course Completed',
    'notifications.mark_read': 'Mark as read',
    'notifications.mark_all_read': 'Mark all as read',
    
    // Stats
    'stats.active_students': 'Active Students',
    'stats.courses_completed': 'Courses Completed',
    'stats.total_xp': 'Total XP',
    'stats.current_streak': 'Current Streak',
    'stats.level': 'Level',
    'stats.achievements': 'Achievements',
    'stats.hours_learned': 'Hours Learned',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.continue_learning': 'Continue Learning',
    'dashboard.your_progress': 'Your Progress',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.achievements': 'Achievements',
    'dashboard.leaderboard': 'Leaderboard',

    // Course
    'course.completed': 'Completed',
    'course.in_progress': 'In Progress',
    'course.locked': 'Locked',
    'course.start': 'Start Course',
    'course.continue': 'Continue',
    'course.quiz': 'Take Quiz',
    'course.back_to_courses': 'Back to Courses',
    'course.chapter': 'Chapter',
    'course.quiz_score': 'Quiz Score',
    'course.passing_score': 'Passing Score',
    'course.attempts': 'Attempts',

    // Quiz
    'quiz.title': 'Course Quiz',
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.submit': 'Submit Quiz',
    'quiz.next_question': 'Next Question',
    'quiz.previous_question': 'Previous Question',
    'quiz.time_remaining': 'Time Remaining',
    'quiz.congratulations': 'Congratulations!',
    'quiz.failed': 'Quiz Failed',
    'quiz.passed': 'Quiz Passed',
    'quiz.score': 'Your Score',
    'quiz.required_score': 'Required Score',
    'quiz.try_again': 'Try Again',
    'quiz.continue_learning': 'Continue Learning',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.view_all': 'View All',
    'common.show_more': 'Show More',
    'common.show_less': 'Show Less',
    
    // Profile
    'profile.edit': 'Edit Profile',
    'profile.language': 'Language',
    'profile.theme': 'Theme',
    'profile.timezone': 'Timezone',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Privacy',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.courses': 'Mis Cursos',
    'nav.community': 'Comunidad',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    
    // Social
    'social.progress_feed': 'Feed de Progreso',
    'social.students': 'Estudiantes',
    'social.messages': 'Mensajes',
    'social.follow': 'Seguir',
    'social.following': 'Siguiendo',
    'social.unfollow': 'Dejar de Seguir',
    'social.followers': 'Seguidores',
    'social.reactions': 'Reacciones',
    'social.message': 'Mensaje',
    'social.recent_completions': 'Finalizaciones Recientes',
    'social.no_activity': 'Sin actividad aún',
    'social.no_students': 'No se encontraron estudiantes',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.courses': 'Mes Cours',
    'nav.community': 'Communauté',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',

    // Hero/Landing
    'hero.title': 'Maîtrisez Web3.',
    'hero.build_future': 'Construisez Votre Avenir.',
    'hero.subtitle': 'Rejoignez des milliers d\'apprenants qui maîtrisent la blockchain, DeFi et le développement Web3 grâce à des cours pratiques conçus par des experts de l\'industrie.',
    'hero.cta': 'Commencer à Apprendre',
    'hero.learn_more': 'En Savoir Plus',

    // Courses
    'courses.title': 'Votre Parcours d\'Apprentissage',
    'courses.subtitle': 'Progressez dans notre programme Web3 complet',
    'courses.start_course': 'Commencer le Cours',
    'courses.continue_course': 'Continuer le Cours',
    'courses.view_course': 'Voir le Cours',
    'courses.locked': 'Verrouillé',
    'courses.completed': 'Terminé',
    'courses.in_progress': 'En Cours',
    'courses.take_quiz': 'Passer le Quiz',
    'courses.retake_quiz': 'Reprendre le Quiz',
    'courses.quiz_required': 'Quiz Requis',
    'courses.progress': 'Progression',
    'courses.chapters': 'Chapitres',
    'courses.duration': 'Durée',
    'courses.difficulty': 'Difficulté',
    'courses.beginner': 'Débutant',
    'courses.intermediate': 'Intermédiaire',
    'courses.advanced': 'Avancé',

    // Social
    'social.title': 'Communauté Academia',
    'social.subtitle': 'Suivez vos camarades étudiants et célébrez leurs réussites d\'apprentissage ensemble',
    'social.progress_feed': 'Fil de Progression',
    'social.students': 'Étudiants',
    'social.messages': 'Messages',
    'social.follow': 'Suivre',
    'social.following': 'Suivi',
    'social.unfollow': 'Ne plus suivre',
    'social.followers': 'Abonnés',
    'social.reactions': 'Réactions',
    'social.message': 'Message',
    'social.recent_completions': 'Achèvements Récents',
    'social.no_activity': 'Aucune activité',
    'social.no_students': 'Aucun étudiant trouvé',
    'social.view_profile': 'Voir le Profil',
    'social.back_to_students': 'Retour aux Étudiants',
    'social.recent_activity': 'Activité Récente',

    // Notifications
    'notifications.new_follower': 'Nouveau Abonné',
    'notifications.reaction': 'Réaction sur votre publication',
    'notifications.comment': 'Commentaire sur votre publication',
    'notifications.course_completed': 'Cours Terminé',
    'notifications.mark_read': 'Marquer comme lu',
    'notifications.mark_all_read': 'Tout marquer comme lu',
    'notifications.title': 'Notifications',
    'notifications.no_notifications': 'Aucune notification',
    'notifications.view_all': 'Voir toutes les notifications',

    // Stats
    'stats.active_students': 'Étudiants Actifs',
    'stats.courses_completed': 'Cours Terminés',
    'stats.total_xp': 'XP Total',
    'stats.current_streak': 'Série Actuelle',
    'stats.level': 'Niveau',
    'stats.achievements': 'Réalisations',
    'stats.hours_learned': 'Heures d\'Apprentissage',

    // Dashboard
    'dashboard.welcome': 'Bon retour',
    'dashboard.continue_learning': 'Continuer l\'Apprentissage',
    'dashboard.your_progress': 'Votre Progression',
    'dashboard.recent_activity': 'Activité Récente',
    'dashboard.achievements': 'Réalisations',
    'dashboard.leaderboard': 'Classement',

    // Course
    'course.completed': 'Terminé',
    'course.in_progress': 'En Cours',
    'course.locked': 'Verrouillé',
    'course.start': 'Commencer le Cours',
    'course.continue': 'Continuer',
    'course.quiz': 'Passer le Quiz',
    'course.back_to_courses': 'Retour aux Cours',
    'course.chapter': 'Chapitre',
    'course.quiz_score': 'Score du Quiz',
    'course.passing_score': 'Score de Réussite',
    'course.attempts': 'Tentatives',

    // Quiz
    'quiz.title': 'Quiz du Cours',
    'quiz.question': 'Question',
    'quiz.of': 'sur',
    'quiz.submit': 'Soumettre le Quiz',
    'quiz.next_question': 'Question Suivante',
    'quiz.previous_question': 'Question Précédente',
    'quiz.time_remaining': 'Temps Restant',
    'quiz.congratulations': 'Félicitations !',
    'quiz.failed': 'Quiz Échoué',
    'quiz.passed': 'Quiz Réussi',
    'quiz.score': 'Votre Score',
    'quiz.required_score': 'Score Requis',
    'quiz.try_again': 'Réessayer',
    'quiz.continue_learning': 'Continuer l\'Apprentissage',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.view_all': 'Voir Tout',
    'common.show_more': 'Afficher Plus',
    'common.show_less': 'Afficher Moins',

    // Profile
    'profile.edit': 'Modifier le Profil',
    'profile.language': 'Langue',
    'profile.theme': 'Thème',
    'profile.timezone': 'Fuseau Horaire',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Confidentialité',
  },
  
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.courses': 'Meus Cursos',
    'nav.community': 'Comunidade',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'nav.login': 'Entrar',
    'nav.signup': 'Cadastrar',
    
    // Social
    'social.progress_feed': 'Feed de Progresso',
    'social.students': 'Estudantes',
    'social.messages': 'Mensagens',
    'social.follow': 'Seguir',
    'social.following': 'Seguindo',
    'social.unfollow': 'Deixar de Seguir',
    'social.followers': 'Seguidores',
    'social.reactions': 'Reações',
    'social.message': 'Mensagem',
    'social.recent_completions': 'Conclusões Recentes',
    'social.no_activity': 'Nenhuma atividade',
    'social.no_students': 'Nenhum estudante encontrado',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.close': 'Fechar',
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('🌍 LanguageProvider: Current language is', currentLanguage);

  useEffect(() => {
    loadLanguages();
    loadUserLanguage();
  }, [user]);

  const loadLanguages = async () => {
    try {
      const { data } = await supabase
        .from('supported_languages')
        .select('code, name, native_name, flag_emoji')
        .eq('is_active', true)
        .order('name');

      setLanguages(data || []);
    } catch (error) {
      console.error('Error loading languages:', error);
    }
  };

  const loadUserLanguage = async () => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('academia_language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }

    if (!user) {
      // Try to detect browser language if no saved preference
      if (!savedLanguage) {
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
          setCurrentLanguage(browserLang);
        }
      }
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('profiles')
        .select('language_code')
        .eq('id', user.id)
        .single();

      if (data?.language_code) {
        setCurrentLanguage(data.language_code);
      }
    } catch (error) {
      console.error('Error loading user language:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (languageCode: string) => {
    console.log('🌍 Setting language to:', languageCode);
    setCurrentLanguage(languageCode);
    localStorage.setItem('academia_language', languageCode);

    if (user) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            language_code: languageCode,
            updated_at: new Date().toISOString()
          });
        console.log('✅ Language saved to database');
      } catch (error) {
        console.error('❌ Error saving language preference:', error);
      }
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[currentLanguage]?.[key] || translations['en'][key] || key;

    // Debug logging
    if (currentLanguage !== 'en' && translations[currentLanguage]?.[key]) {
      console.log(`🔤 Translating "${key}" to "${translation}" (${currentLanguage})`);
    }

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      languages,
      setLanguage,
      t,
      loading
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
