import { Dialog, DialogContent, DialogTitle, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, DialogActions, Typography } from "@mui/material";
import { ECompany, ICard, useCreateCard } from "CardStore";
import React, { useState } from "react";



const CreateCardDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
    const { isOpen, onClose } = props;

    const createCard = useCreateCard();

    const [ newCardState, setNewCardState ] = useState<Partial<ICard>>({
        name: '',
        description: '',
        company: ECompany.TD,
        type: 'POINTS',
        openDate: '',
    });

    const updateCardDetails = (fieldName: keyof ICard, updatedValue: any) => {
        setNewCardState((prev) => ({
            ...prev,
            [fieldName]: updatedValue
        }))
    }

    const handleCreate = () => {
        createCard({
            ...newCardState
        })

        onClose();
    }

    return (
        <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose}>
            <DialogTitle>Add new card</DialogTitle>
            <DialogContent>
                <FormControl sx={{ width: '100%', marginBottom: '15px', marginTop: '10px' }}>
                    <InputLabel>Card Type</InputLabel>
                    <Select onChange={(event) => updateCardDetails('type', event.target.value)} value={newCardState.type} label="Card Type">
                        <MenuItem value="POINTS">Rewards Points</MenuItem>
                        <MenuItem value="CASHBACK">Cashback</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ width: '100%', marginBottom: '15px', marginTop: '10px' }}>
                    <InputLabel>Company</InputLabel>
                    <Select onChange={(event) => updateCardDetails('company', event.target.value)} value={newCardState.company} label="Company">
                        <MenuItem value={ECompany.TD}>TD</MenuItem>
                        <MenuItem value={ECompany.CIBC}>CIBC</MenuItem>
                        <MenuItem value={ECompany.RBC}>RBC</MenuItem>
                        <MenuItem value={ECompany.SCOTIABANK}>Scotiabank</MenuItem>
                        <MenuItem value={ECompany.AMEX}>American Express</MenuItem>
                        <MenuItem value={ECompany.CHASE}>Chase</MenuItem>
                        <MenuItem value={ECompany.HSBC}>HSBC</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ marginBottom: '15px' }}>
                    <TextField onChange={(event) => updateCardDetails('name', event.target.value)} sx={{ width: '100%' }} label="name" />
                </Box>
                <Box sx={{ marginBottom: '15px' }}>
                    <TextField onChange={(event) => updateCardDetails('description', event.target.value)} sx={{ width: '100%' }} label="description" />
                </Box>

                <Box>
                    <Typography>Open Date</Typography>
                    <TextField 
                        value={newCardState.openDate} 
                        onChange={(event) => updateCardDetails('openDate', event.target.value)}
                        type="date" 
                    />
                </Box>

                <DialogActions>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>

            </DialogContent>
        </Dialog>
    )
}

export default CreateCardDialog;