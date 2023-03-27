import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from "@mui/material";
import { IGoal, IRepeatedGoalConfig, ISingleGoalConfig, useAddOrUpdateGoal, useDeleteGoal } from "CardStore";
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

    const updateGoalMetadataConfig = (field: keyof ISingleGoalConfig | keyof IRepeatedGoalConfig, value: string | number) => {
        setGoalState((state) => ({
            ...state,
            metadata: {
                ...state.metadata,
                configs: {
                    ...state.metadata.configs,
                    [field]: value
                }
            }
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <TextField 
                        value={goalState.reward}
                        onChange={(event) => updateValue('reward', parseInt(event.target.value) || 0)} 
                        sx={{ width: '49%' }} 
                        type="number" 
                        label="reward"
                    />
                    <TextField 
                        value={goalState.spendRequired}
                        onChange={(event) => updateValue('spendRequired', parseInt(event.target.value) || 0)} 
                        sx={{ width: '49%' }} 
                        type="number" 
                        label="Minimum Spend Required" 
                    />
                </Box>
                <TextField 
                    value={goalState.altReward}
                    onChange={(event) => updateValue('altReward', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }}
                    label="Alternative reward" 
                />
                {
                    goalState.metadata.goalMode === 'single-goal' ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ width: '49%' }}>
                                <Typography>Goal Start Date</Typography>
                                <TextField
                                    sx={{ width: '100%' }}
                                    value={(goalState.metadata.configs as ISingleGoalConfig).goalStartDate || ''}
                                    onChange={(event) => updateGoalMetadataConfig('goalStartDate', event.target.value)} 
                                    type="date" />
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <Typography>Goal End Date</Typography>
                                <TextField
                                    sx={{ width: '100%' }} 
                                    value={(goalState.metadata.configs as ISingleGoalConfig).goalEndDate || ''}
                                    onChange={(event) => updateGoalMetadataConfig('goalEndDate', event.target.value)} 
                                    type="date" />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex' }}>
                            <TextField 
                                type="date"
                                sx={{ width: '140px', marginRight: '10px' }}
                                value={(goalState.metadata.configs as IRepeatedGoalConfig).goalStartDate} 
                                onChange={(event) => updateGoalMetadataConfig('goalStartDate', event.target.value)}
                            />
                            <TextField
                                disabled
                                sx={{ width: '100px', marginRight: '10px' }}
                                value="monthly"
                                />
                            <TextField 
                                onChange={(event) => updateGoalMetadataConfig('numOccurrences', parseInt(event.target.value) || 0)}
                                label='# of occurrences'
                                value={(goalState.metadata.configs as IRepeatedGoalConfig).numOccurrences}

                            />
                        </Box>
                    )
                }
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', margin: '0 1rem' }}>
                <Button onClick={() => deleteGoal(cardId || '', props.goal.id)} color="error" variant="outlined">Delete goal</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditGoalDialog;