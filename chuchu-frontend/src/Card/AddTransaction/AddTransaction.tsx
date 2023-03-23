import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { ITransaction, useAddOrUpdateTransaction, useGetCardCategories } from 'CardStore';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AddTransaction: React.FC = (props) => {
    const { cardId } = useParams<{ cardId: string }>()
    const categories = useGetCardCategories(cardId || '')
    const addOrUpdateTransaction = useAddOrUpdateTransaction();

    const [ transactionState, setTransactionState ] = useState({
        date: '',
        payee: '',
        note: '',
        amount: 0,
        category: ''
    });

    const handleUpdate = (field: keyof ITransaction, value: any) => {
        setTransactionState((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAdd = () => {
        if (cardId) {
            const categoryIndex = categories.findIndex(x => x.id === transactionState.category);
            if (categoryIndex < 0) return;
            addOrUpdateTransaction(
                cardId,
                {
                    id: '',
                    date: transactionState.date,
                    payee: transactionState.payee,
                    note: transactionState.note,
                    amount: transactionState.amount,
                    category: categories[categoryIndex]
                }
            )
            setTransactionState({
                date: '',
                payee: '',
                note: '',
                amount: 0,
                category: ''
            })
        }
    }

    const buttonDisabled = 
        transactionState.category.length === 0 || 
        transactionState.date.length === 0 ||
        !transactionState.amount 

    return (
        <Box sx={{ marginBottom: '1rem', display: 'flex' }}>
            <TextField 
                onChange={(event) => handleUpdate('date', event.target.value)}
                value={transactionState.date} 
                type="date" 
                size='small' 
                sx={{ marginRight: '10px', flexGrow: 1 }} 
            />
            <TextField
                onChange={(event) => handleUpdate('payee', event.target.value)}
                value={transactionState.payee} 
                size='small' 
                label="Payee"
                sx={{ marginRight: '10px', flexGrow: 1 }} 
            />
            <TextField
                onChange={(event) => handleUpdate('note', event.target.value)}
                value={transactionState.note} 
                size='small' 
                label="Note"
                sx={{ marginRight: '10px', flexGrow: 1 }}
            />
            <TextField
                onChange={(event) => handleUpdate('amount', parseFloat(event.target.value))}
                value={transactionState.amount} 
                size='small'
                type="number"
                label="Amount"
                sx={{ marginRight: '10px', flexGrow: 1 }} 
            />
            <Box sx={{ marginRight: '10px', flex: '1 1 0' }} >
                <FormControl size="small" sx={{ width: '100%', minWidth: '150px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        size="small"
                        label="Category"
                        onChange={(event) => handleUpdate('category', event.target.value)} 
                        value={transactionState.category}
                    >
                        {categories.map(category => (
                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button 
                color="secondary"
                disabled={buttonDisabled}
                onClick={handleAdd}
            >
                Add
            </Button>
        </Box>
    )
}

export default AddTransaction;