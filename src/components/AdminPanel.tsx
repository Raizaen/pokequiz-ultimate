import { useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { QuestionEditor } from './QuestionEditor'

type AccessState = 'checking' | 'anonymous' | 'forbidden' | 'admin'

interface Props {
  onBack: () => void
  onQuestionsChanged: () => void
}

export function AdminPanel({ onBack, onQuestionsChanged }: Props) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [access, setAccess] = useState<AccessState>('checking')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const client = supabase
    if (!client) {
      setAccess('anonymous')
      return
    }

    const checkAccess = async (nextUser: User | null) => {
      setUser(nextUser)
      if (!nextUser) {
        setAccess('anonymous')
        return
      }

      setAccess('checking')
      const { data, error } = await client
        .from('admin_users')
        .select('user_id')
        .eq('user_id', nextUser.id)
        .maybeSingle()

      setAccess(!error && data ? 'admin' : 'forbidden')
    }

    void client.auth.getUser().then(({ data }) => checkAccess(data.user))
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      void checkAccess(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const requestMagicLink = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !email.trim()) return

    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    setMessage(error
      ? 'Connexion refusée. Vérifie que cette adresse a bien été invitée comme administrateur.'
      : 'Lien envoyé. Ouvre le message reçu puis reviens sur PokéQuiz Ultimate.')
    setBusy(false)
  }

  const signOut = async () => {
    await supabase?.auth.signOut()
    setAccess('anonymous')
    setUser(null)
  }

  return (
    <main className="app-shell admin-shell">
      <nav>
        <button className="ghost" onClick={onBack}>← Retour</button>
        <span className="admin-badge">Administration</span>
      </nav>

      <section className={`admin-card ${access === 'admin' ? 'editor-enabled' : ''}`}>
        <span className="eyebrow">ESPACE PROTÉGÉ</span>
        <h1>Gestion de PokéQuiz</h1>

        {!isSupabaseConfigured && (
          <p className="admin-warning">La connexion administrateur n’est pas configurée sur cet environnement.</p>
        )}

        {isSupabaseConfigured && access === 'checking' && <p>Vérification de ton accès…</p>}

        {isSupabaseConfigured && access === 'anonymous' && (
          <>
            <p>Reçois un lien de connexion à usage unique sur ton adresse administrateur.</p>
            <form className="admin-login" onSubmit={requestMagicLink}>
              <label htmlFor="admin-email">Adresse e-mail administrateur</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nom@exemple.fr"
                required
              />
              <button className="primary" disabled={busy}>
                {busy ? 'Envoi…' : 'Recevoir mon lien sécurisé'}
              </button>
            </form>
            {message && <p className="admin-message">{message}</p>}
          </>
        )}

        {access === 'forbidden' && (
          <>
            <p className="admin-warning">
              Le compte {user?.email} est connecté, mais ne possède pas les droits d’administration.
            </p>
            <button onClick={signOut}>Se déconnecter</button>
          </>
        )}

        {access === 'admin' && (
          <>
            <div className="admin-success">
              <strong>✓ Accès administrateur confirmé</strong>
              <span>{user?.email}</span>
            </div>
            <QuestionEditor user={user!} onQuestionsChanged={onQuestionsChanged} />
            <button className="admin-signout" onClick={signOut}>Se déconnecter</button>
          </>
        )}
      </section>
    </main>
  )
}
