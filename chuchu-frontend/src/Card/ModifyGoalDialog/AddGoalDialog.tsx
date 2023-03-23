import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from "@mui/material";
import { IGoal, useAddOrUpdateGoal } from "CardStore";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddGoalDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();

    const addOrUpdateGoal = useAddOrUpdateGoal();

    const [ goalState, setGoalState ] = useState<IGoal>({
        id: '',
        name: '',
        description: '',
        reward: 0,
        altReward: '',
        spendRequired: 0,
        goalStartDate: '',
        goalEndDate: ''
    });

    const updateValue = (fieldName: keyof IGoal, value: any) => {
        setGoalState((state) => ({
            ...state,
            [fieldName]: value
        }))
    }

    const handleCreate = () => {
        if (cardId) {
            addOrUpdateGoal(cardId, {
                ...goalState
            })
            props.onClose();
        }
    }

    return (
        <Dialog fullWidth maxWidth="xs" open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogContent>
                <TextField 
                    onChange={(event) => updateValue('name', event.target.value)} 
                    sx={{ width: '100%', marginTop: '15px', marginBottom: '1rem' }} 
                    label="name" 
                />
                <TextField 
                    onChange={(event) => updateValue('description', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }} 
                    label="description" 
                />
                <TextField 
                    onChange={(event) => updateValue('reward', parseInt(event.target.value))} 
                    sx={{ width: '100%', marginBottom: '1rem' }} 
                    type="number" 
                    label="reward"
                />
                <TextField 
                    onChange={(event) => updateValue('altReward', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }}
                    label="Alternative reward" 
                />
                <TextField 
                    onChange={(event) => updateValue('spendRequired', parseInt(event.target.value))} 
                    sx={{ width: '100%' }} 
                    type="number" 
                    label="Minimum Spend Required" 
                />
                <Box sx={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '45%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                        <Typography>Goal Start Date</Typography>
                        <TextField
                            onChange={(event) => updateValue('goalStartDate', event.target.value)} 
                            type="date" />
                    </Box>
                    <Box sx={{ width: '45%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                        <Typography>Goal End Date</Typography>
                        <TextField 
                            onChange={(event) => updateValue('goalEndDate', event.target.value)} 
                            type="date" />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddGoalDialog;