import {
    integer,numeric,pgTable,serial, varchar
}from 'drizzle-orm/pg-core'
import { Icon } from 'lucide-react'

// budget Schema
export const Budgets = pgTable('budgets', {
    id : serial('id').primaryKey(),
    name : varchar('name').notNull(),
    amount : varchar('amount').notNull(),
    Icon : varchar('icon'),
    createdBy: varchar('createdBy').notNull()
})

// income schema
export const Incomes = pgTable('incomes', {
    id : serial('id').primaryKey(),
    name : varchar('name').notNull(),
    amount : varchar('amount').notNull(),
    Icon : varchar('icon'),
    createdBy: varchar('createdBy').notNull()
})

// expence schema
export const Expences = pgTable('expences', {
    id : serial('id').primaryKey(),
    name : varchar('name').notNull(),
    amount : varchar('amount').notNull(),
    budgetId : integer('budgetId').references(()=> Budgets.id),
    createdBy: varchar('createdBy').notNull(),
});