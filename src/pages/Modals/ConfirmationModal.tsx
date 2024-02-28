import { Box, Button, Modal, Text } from "@mantine/core";

function ConfirmationModal({ isOpen, title, message, onClose }: { isOpen: boolean, title?: string, message?: string, onClose: (ok: boolean) => void }) {
    return (
        <Modal centered opened={isOpen} title={title || 'Confirmation?'} onClose={() => onClose(false)}>
            <Box>
                <Text mb="lg">{message || 'Are you sure you want to do this?'}</Text>
                <Box display="flex">
                    <Button onClick={() => onClose(false)} fullWidth color="red" variant="subtle">Cancel</Button>
                    <Button onClick={() => onClose(true)} fullWidth>Confirm</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ConfirmationModal;