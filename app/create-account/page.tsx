import type { Metadata } from "next"
import Link from "next/link"
import CreateAccountForm from "@/components/create-account-form"

export const metadata: Metadata = {
    title: "Create Account | MailBox",
    description: "Create a new account for MailBox email service",
}

export default function CreateAccountPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">MailBox</h1>
                    <p className="mt-2 text-sm text-gray-600">Create your personal email account</p>
                </div>
                <CreateAccountForm />
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
