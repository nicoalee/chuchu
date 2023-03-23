import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from "@mui/material";
import { IGoal, useAddOrUpdateGoal, useDeleteGoal } from "CardStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditGoalDialog: React.FC<{ isOpen: boolean; onClose: () => void, goal: IGoal }> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const addOrUpdateGoal = useAddOrUpdateGoal();
    const deleteGoal = useDeleteGoal();

    const [ goalState, setGoalState ] = useState<IGoal>(props.goal);

    useEffect(() => {
        setGoalState(props.goal)
    }, [props.goal])

    const updateValue = (fieldName: keyof IGoal, value: any) => {
        setGoalState((state) => ({
            ...state,
            [fieldName]: value
        }))
    }

    const handleUpdate = () => {
        if (cardId) {
            addOrUpdateGoal(cardId, {
                ...goalState
            })
            props.onClose();
        }
    }

    return (
        <Dialog fullWidth maxWidth="xs" open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogContent>
                <TextField
                    value={goalState.name}
                    onChange={(event) => updateValue('name', event.target.value)}
                    sx={{ width: '100%', marginTop: '15px', marginBottom: '1rem' }}
                    label="name"
                />
                <TextField 
                    value={goalState.description}
                    onChange={(event) => updateValue('description', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }} 
                    label="description" 
                />
                <TextField 
                    value={goalState.reward}
                    onChange={(event) => updateValue('reward', parseInt(event.target.value) || 0)} 
                    sx={{ width: '100%', marginBottom: '1rem' }} 
                    type="number" 
                    label="reward"
                />
                <TextField 
                    value={goalState.altReward}
                    onChange={(event) => updateValue('altReward', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }}
                    label="Alternative reward" 
                />
                <TextField 
                    value={goalState.spendRequired}
                    onChange={(event) => updateValue('spendRequired', parseInt(event.target.value) || 0)} 
                    sx={{ width: '100%' }} 
                    type="number" 
                    label="Minimum Spend Required" 
                />
                <Box sx={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '45%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                        <Typography>Goal Start Date</Typography>
                        <TextField
                            value={goalState.goalStartDate}
                            onChange={(event) => updateValue('goalStartDate', event.target.value)} 
                            type="date" />
                    </Box>
                    <Box sx={{ width: '45%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                        <Typography>Goal End Date</Typography>
                        <TextField 
                            value={goalState.goalStartDate}
                            onChange={(event) => updateValue('goalEndDate', event.target.value)} 
                            type="date" />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', margin: '0 1rem' }}>
                <Button onClick={() => deleteGoal(cardId || '', props.goal.id)} color="error" variant="outlined">Delete goal</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditGoalDialog;