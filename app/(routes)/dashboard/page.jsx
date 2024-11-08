"use client";

import { useState, useEffect } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/db.config";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expences, Incomes } from "@/utils/schema";
import { BarChart } from "lucide-react";
import BarChartDashboard from "./_components/BarChartDashboard";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";


function Dashboard() {
    const { user } = useUser();

    const [budgetList, setBudgetList] = useState([])
    const [incomeList, setIncomeList] = useState([])
    const [expenseList, setExpenceList] = ([])

    useEffect(() => {
        user && getBudgetList()
    }, [user])

    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum${Expences.amount}`.mapWith(Number),
            totalItem: sql`count(${Expences.id})`.mapWith(Number)
        }).from(Budgets).leftJoin(Expences, eq(Budgets.id, Expences.budgetId)).where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id))

        setBudgetList(result)
        getAllExpenses();
        getIncomeList();
    }

    const getAllExpenses = async () => {
        const result = await db.select({
            id: Expences.id,
            name: Expences.name,
            amount: Expences.amount,
            createdAt: Expences.createdAt
        }).from(Budgets).rightJoin(Expences, eq(Budgets.id, Expences.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(Expences.id))
        setExpenceList(result)
    }

    const getIncomeList = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Incomes),
                totalAmount: sql`sum(cast(${Incomes.amount} as numeric())`.mapWith(Number),
            }).from(Incomes).groupBy(Incomes.id)

            setIncomeList(result)
        } catch (error) {
            console.log('error fetching income List', error);
        }
    }

    return (
        <div className="p-8">
            <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
            <p className="text-gray-500">
                Here's what happenning with your money, Lets Manage your expense
            </p>

            <CardInfo budgetList={budgetList} incomeList={incomeList} />
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5 ">
                <div className="lg:col-span-2">
                    <BarChartDashboard budgetList={budgetList} />

                    <ExpenseListTable
                        expenseList={expenseList}
                        refreshData={() => getBudgetList()}
                    />
                </div>
                <div className="grid gap-5">
                    <h2 className="font-bold text-lg">Latest Budgets</h2>
                    {budgetList?.length > 0
                        ? budgetList.map((budget, index) => (
                            <BudgetItem budget={budget} key={index} />
                        ))
                        : [1, 2, 3, 4].map((item, index) => (
                            <div className="h-[180xp] w-full bg-slate-200 rounded-lg animate-pulse"></div>
                        ))}
                </div>


            </div>
        </div>
    )

}
export default Dashboard;