import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box, Switch, FormGroup, InputLabel } from "@mui/material";
import { IGoal, IRepeatedGoalConfig, ISingleGoalConfig, useAddOrUpdateGoal } from "CardStore";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddGoalDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();

    const addOrUpdateGoal = useAddOrUpdateGoal();

    const [isRepeatedGoalMode, setIsRepeatedGoalMode] = useState(false);

    const [ goalState, setGoalState ] = useState<IGoal>({
        id: '',
        name: '',
        description: '',
        reward: 0,
        altReward: '',
        spendRequired: 0,
        metadata: {
            goalMode: 'single-goal',
            configs: undefined
        },
    });

    const updateValue = (fieldName: keyof IGoal, value: any) => {
        setGoalState((state) => ({
            ...state,
            [fieldName]: value
        }))
    }

    const handleUpdateSingleGoalConfig = (date: 'goalStartDate' | 'goalEndDate', value: string) => {
        setGoalState((state) => ({
            ...state,
            metadata: {
                goalMode: 'single-goal',
                configs: {
                    ...state.metadata.configs,
                    [date]: value,
                }
            }
        }))
    }

    const handleUpdateRepeatedGoalConfig = (field: 'goalStartDate' | 'repeatType' | 'numOccurrences', value: string | number) => {
        setGoalState((state) => ({
            ...state,
            metadata: {
                goalMode: 'repeated-goal',
                configs: {
                    ...state.metadata.configs,
                    repeatType: 'monthly',
                    [field]: value
                }
            }
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

    const disableCreate = 
        goalState.name === '' || 
        !goalState.spendRequired || 
        (
            (!goalState.metadata.configs?.goalStartDate || !(goalState.metadata.configs as ISingleGoalConfig)?.goalEndDate) && 
            !(goalState.metadata.configs as IRepeatedGoalConfig)?.numOccurrences
        )

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <TextField 
                        onChange={(event) => updateValue('spendRequired', parseInt(event.target.value))} 
                        sx={{ width: '49%' }} 
                        type="number" 
                        label="Minimum Spend Required" 
                    />
                    <TextField 
                        onChange={(event) => updateValue('reward', parseInt(event.target.value))} 
                        sx={{ width: '49%' }} 
                        type="number" 
                        label="reward"
                    />
                </Box>
                <TextField 
                    onChange={(event) => updateValue('altReward', event.target.value)} 
                    sx={{ width: '100%', marginBottom: '1rem' }}
                    label="Alternative reward (optional)" 
                />
                <Box sx={{ marginTop: '1rem' }}>
                    <FormGroup>
                        <InputLabel>
                            {isRepeatedGoalMode ? 'Repeated Goal' : 'Single Goal'}
                         </InputLabel>
                         <Switch value={isRepeatedGoalMode} onChange={() => setIsRepeatedGoalMode(prev => !prev)} />
                    </FormGroup>
                    {
                        isRepeatedGoalMode ? (
                            <Box>
                                <Typography gutterBottom>Goal Start Date</Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <TextField
                                        sx={{ width: '220px', marginRight: '10px' }}
                                        onChange={(event) => handleUpdateRepeatedGoalConfig('goalStartDate', event.target.value)} 
                                        type="date" />
                                    <TextField sx={{ width: '130px', marginRight: '10px' }} label="monthly" disabled />
                                    <TextField 
                                        onChange={(event) => handleUpdateRepeatedGoalConfig('numOccurrences', parseInt(event.target.value) || 0)} 
                                        sx={{ flexGrow: 1 }} 
                                        type="number" 
                                        label="# of occurrences" 
                                    />
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ width: '49%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                    <Typography>Goal Start Date</Typography>
                                    <TextField
                                        onChange={(event) => handleUpdateSingleGoalConfig('goalStartDate', event.target.value)} 
                                        type="date" />
                                </Box>
                                <Box sx={{ width: '49%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                    <Typography>Goal End Date</Typography>
                                    <TextField 
                                        onChange={(event) => handleUpdateSingleGoalConfig('goalEndDate', event.target.value)} 
                                        type="date" />
                                </Box> 
                            </Box>
                        )
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableCreate} onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddGoalDialog;