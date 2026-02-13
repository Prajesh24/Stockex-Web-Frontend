
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import Image from "next/image";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const response = await handleGetOneUser(id);
    if (!response.success) {
        throw new Error(response.message || 'Failed to load user');
    }

    const user = response.data;

    return (
        <div>
            <Link href="/admin/users" className="text-blue-500 hover:underline">
                Back to Users
            </Link>
            <Link href={`/admin/users/${id}/edit`} className="text-green-500 hover:underline ml-4">
                Edit User
            </Link>

            <h1 className="text-2xl font-bold mb-4 mt-2">User Details</h1>

            <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4">
                {user.imageUrl ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`}
                        alt={user.name || "User Image"}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        No Image
                    </div>
                )}

                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
        </div>
    );
}
