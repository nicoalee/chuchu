import { Box, Typography } from "@mui/material";
import useGetRequiredSpend from "hooks/useGetRequiredSpend";

const RequiredSpend: React.FC<{ cardId?: string }> = (props) => {
    const requiredSpend = useGetRequiredSpend(props.cardId || '');

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: 'orange' }}>Required Spend left this month:</Typography>
            <Typography variant="h4" sx={{ color: 'orange' }}>{requiredSpend}</Typography>
        </Box>
    )
}

export default RequiredSpend;