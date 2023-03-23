import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ICategory, useAddCategory } from "CardStore";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddCategoryDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const addCategory = useAddCategory();

    const [categoryState, setCategoryState] = useState({
        name: '',
        rewardRatio: 0
    })

    const update = (fieldName: keyof ICategory, value: any) => {
        setCategoryState((state) => ({
            ...state,
            [fieldName]: value
        }))
    }

    const handleCreate = () => {
        if (cardId) {
            addCategory(cardId, {
                id: '',
                name: categoryState.name,
                rewardRatio: categoryState.rewardRatio
            })
            props.onClose()
        } 
    }

    return (
        <Dialog fullWidth maxWidth='xs' open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
                <TextField 
                    sx={{ width: '100%', marginBottom: '1rem', marginTop: '10px' }} 
                    onChange={(event) => update('name', event.target.value)} 
                    label="name" 
                    value={categoryState.name} 
                />
                <TextField 
                    sx={{ width: '100%' }} 
                    onChange={(event) => update('rewardRatio', parseFloat(event.target.value))} 
                    label="Reward per dollar" 
                    type="number"
                    value={categoryState.rewardRatio} 
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddCategoryDialog;