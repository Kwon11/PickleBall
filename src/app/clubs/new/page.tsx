"use client";

import { ClubForm } from "@/components/ClubForm";

export default function NewClubPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Club</h1>
      <ClubForm />
    </div>
  );
} 