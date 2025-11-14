"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardGrid } from "@/components/dasboard/DashboardGrid";
import { DashboardHeader } from "@/components/dasboard/DashboardHeader";
import { DashboardLayout } from "@/components/dasboard/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthProvider";

export default function DashboardPage() {
	return (
		<AuthProvider>
			<ProtectedRoute
				fallbackTitle="SABS Dashboard"
				fallbackSubtitle="Entrez votre code PIN pour accéder au tableau de bord"
			>
				<DashboardLayout>
					<DashboardHeader />
					<DashboardGrid />
				</DashboardLayout>
			</ProtectedRoute>
		</AuthProvider>
	);
}
