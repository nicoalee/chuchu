import { Button } from "@mui/material";
import React from "react";
import CreateCardDialog from "./CreateCardDialog";

const CreateCardComponent: React.FC = (props) => {
    const [ createCardDialogIsOpen, setCardDialogIsOpen ] = React.useState(false);

    return (
        <>
            <CreateCardDialog isOpen={createCardDialogIsOpen} onClose={() => setCardDialogIsOpen(false)} />
            <Button variant="contained" onClick={() => setCardDialogIsOpen(true)}>Add New Card</Button>
        </>
    )
}

export default CreateCardComponent;