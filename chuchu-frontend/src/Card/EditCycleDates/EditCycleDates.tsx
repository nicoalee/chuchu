import { Dialog, DialogTitle, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetCardCycleData } from "../../CardStore";
import React from "react";

const EditCycleDates: React.FC<{
    isOpen: boolean;

}> = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const getCardCycleData = useGetCardCycleData(cardId || '')

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle>Edit Cycle</DialogTitle>

            <Typography>Open Date</Typography>
            <TextField />

            <Typography>Close Date</Typography>
            <TextField />
        </Dialog>
    )
}

export default EditCycleDates;