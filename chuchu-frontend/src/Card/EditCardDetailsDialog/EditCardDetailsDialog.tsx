import { Dialog, DialogContent, DialogTitle, TextField, Typography, Box, DialogActions, Button } from "@mui/material";
import { ICard, useUpdateCard } from "CardStore";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EditCardDetailsDialog: React.FC<{ isOpen: boolean; onClose: () => void, cardData: ICard }> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const updateCardDates = useUpdateCard();

    const [ cardDateState, setCardDateState ] = useState({
        openDate: props.cardData.openDate || '',
        closeDate: props.cardData.closeDate || '',
        cycleStartDay: props.cardData.cycleStartDay || 0,
        cycleEndDay: props.cardData.cycleEndDay || 0,
        name: props.cardData.name || '',
        description: props.cardData.description || ''
    });

    const handleUpdate = () => {
        if (cardId) {
            updateCardDates({
                id: cardId,
                openDate: cardDateState.openDate,
                closeDate: cardDateState.closeDate,
                cycleStartDay: cardDateState.cycleStartDay,
                cycleEndDay: cardDateState.cycleEndDay,
                name: cardDateState.name,
                description: cardDateState.description
            })
        }

        props.onClose();
    }

    const updateValue = (fieldName: keyof ICard, value: any) => {
        setCardDateState((prev) => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (
        <Dialog fullWidth maxWidth="xs" open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Edit Card Details</DialogTitle>
            <DialogContent>
                <TextField 
                    onChange={(event) => updateValue('name', event.target.value)}
                    sx={{ marginBottom: '1rem', width: '100%', marginTop: '10px' }} 
                    label="name" 
                    value={cardDateState.name} 
                />
                <TextField 
                    onChange={(event) => updateValue('description', event.target.value)}
                    sx={{ marginBottom: '1rem', width: '100%', marginTop: '10px' }} 
                    label="description" 
                    multiline
                    rows={4}
                    value={cardDateState.description} 
                />
                <Box sx={{ marginBottom: '1rem' }}>
                    <Typography>Credit Card Open Date</Typography>
                    <TextField 
                        value={cardDateState.openDate}
                        onChange={(event) => updateValue('openDate', event.target.value)} 
                        size="small" 
                        type="date" 
                    />
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                    <Typography>Credit Card Close Date</Typography>
                    <TextField 
                        value={cardDateState.closeDate}
                        onChange={(event) => updateValue('closeDate', event.target.value)} 
                        size="small" 
                        type="date" 
                    />
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                    <Typography>Credit Card Start Day</Typography>
                    <TextField 
                        value={cardDateState.cycleStartDay}
                        onChange={(event) => updateValue('cycleStartDay', parseInt(event.target.value) || 0)} 
                        sx={{ width: '80px' }} 
                        size="small" 
                        type="number" 
                    />
                </Box>
                <Box>
                    <Typography>Credit Card End Day</Typography>
                    <TextField 
                        value={cardDateState.cycleEndDay}
                        onChange={(event) => updateValue('cycleEndDay', parseInt(event.target.value) || 0)} 
                        sx={{ width: '80px' }} 
                        size="small" 
                        type="number" 
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '1rem' }}>
                <Button onClick={handleUpdate} size="large">Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditCardDetailsDialog;