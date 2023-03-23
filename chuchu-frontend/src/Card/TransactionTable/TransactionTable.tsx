import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from '@mui/material';
import { useAddOrUpdateTransaction, useDeleteTransaction, useGetCardCategories, useGetCardCycleData, useGetCardTransactions } from "../../CardStore";
import { useParams } from "react-router-dom";
import React from "react";
import { DateTime } from "luxon";

interface ModifiedTransaction {
    id: string;
    date: Date;
    amount: number;
    payee: string;
    note: string;
    category: string;
}

const getCycle = (
    mode: 'actual' | 'payment', // actual cycle is the 
    transactionDateStr: string, 
    openDateStr: string, 
    cycleStartDate: number
) => {
    let cycleStartStr;
    if (mode === 'payment') {
        const openDate = new Date(openDateStr);
        const month = ('0' + openDate.getMonth() + 1).slice(-2);
        const date = ('0' + cycleStartDate).slice(-2)
        cycleStartStr = `${openDate.getFullYear()}-${month}-${date}`;
    } else {
        cycleStartStr = openDateStr;
    }

    const transactionDate = DateTime.fromISO(transactionDateStr);
    const actualCycleStartDate = DateTime.fromISO(cycleStartStr);

    const diffInMonthsObj = transactionDate.diff(actualCycleStartDate, 'months').toObject();
    const diffInMonths = Math.floor(diffInMonthsObj.months || 0);
    return diffInMonths < 0 ? 0 : diffInMonths + 1;
}

const TransactionTable: React.FC = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const transactions = useGetCardTransactions(cardId || '');
    const categories = useGetCardCategories(cardId || '');
    const deleteTransaction = useDeleteTransaction();
    const addOrUpdateTransaction = useAddOrUpdateTransaction();
    const cycleData = useGetCardCycleData(cardId || '');

    const columns: GridColDef<ModifiedTransaction>[] = [
        { field: "date", headerName: "Date", type: "date", editable: true, width: 100 },
        { field: "payee", headerName: "Payee", editable: true },
        { field: "note", headerName: "Note", editable: true, flex: 1 },
        { field: "amount", headerName: "Amount", type: 'number', editable: true },
        { 
            field: "category", 
            headerName: "Category", 
            editable: true, 
            type: 'singleSelect', 
            valueOptions: categories,
            getOptionLabel: (category: any) => category.name,
            getOptionValue: (category: any) => category.id,
            width: 100,
        },
        { field: 'reward', headerName: 'Reward', editable: false },
        { field: "paymentCycle", headerName: "Payment Cycle", width: 120, editable: false, },
        { field: "actualCycle", headerName: "Actual Cycle", width: 100, editable: false },
        { 
            field: 'Action', 
            headerName: 'Delete', 
            editable: false, 
            sortable: false, 
            filterable: false, 
            width: 80,  
            renderCell: (params) => (
                <Button onClick={(value) => deleteTransaction(cardId || '', params.row.id)} color="error">Delete</Button>
            )

        }
    ]

    const rows = transactions.map((transaction) => ({
        id: transaction.id,
        date: new Date(`${transaction.date} EST`),
        amount: transaction.amount,
        payee: transaction.payee,
        note: transaction.note,
        category: transaction.category.id,
        reward: Math.round(transaction.amount * transaction.category.rewardRatio),
        paymentCycle: getCycle('payment', transaction.date, cycleData?.openDate || '', cycleData?.cycleStartDay || 0),
        actualCycle: getCycle('actual', transaction.date, cycleData?.openDate || '', cycleData?.cycleStartDay || 0),
    }));

    const handleRowUpdate = (newRow: ModifiedTransaction, oldRow: ModifiedTransaction) => {
        console.log(newRow)
        const categoryIndex = categories.findIndex(x => x.id === newRow.category);
        if (categoryIndex < 0) return oldRow

        const transaction = {
            ...oldRow,
            ...newRow,
        }

        const updatedDate = DateTime.fromJSDate(newRow.date);
        addOrUpdateTransaction(cardId || '', {
            ...transaction,
            date: `${updatedDate.toISODate()}`,
            category: categories[categoryIndex]
        })
        console.log(`${updatedDate.toISODate()}`)
        return transaction
    }

    return (
        <Box sx={{ height: `${(rows.length * 52) + 58}px` }}>
            <DataGrid 
                editMode='row' 
                processRowUpdate={handleRowUpdate} 
                hideFooter 
                rows={rows} 
                columns={columns} 
            />
        </Box>
    )
}

export default TransactionTable;