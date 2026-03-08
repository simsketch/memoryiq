import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a1035] flex items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#8b5cf6',
            colorBackground: '#1a1035',
            colorText: '#ffffff',
          },
        }}
      />
    </div>
  )
}
