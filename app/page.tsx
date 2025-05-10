import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is authenticated
  // If authenticated, redirect to dashboard
  // For demo purposes, we'll just show the login page

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">MailBox</h1>
          <p className="mt-2 text-sm text-gray-600">Your personal email service</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
