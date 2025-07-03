// app/goal-planner/page.tsx
'use client';

import { GoalPlannerMockup } from '@/Features/GoalPlanner/UI/GoalPlannerMockup';
import MainHeader from "@/shared/Components/MainHeader"; // Ajusta la ruta si es necesario

export default function GoalPlannerPage() {
    return (
        <main className="h-dvh w-full flex flex-col md:min-h-screen md:flex-row md:items-center md:justify-center md:bg-gray-50 md:p-4 pt-16 md:pt-0">
            <MainHeader />
            <GoalPlannerMockup />
        </main>
    );
}