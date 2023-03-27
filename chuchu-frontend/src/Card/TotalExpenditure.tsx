import { Box, Typography } from "@mui/material";
import useGetTotalSpend from "hooks/useGetTotalSpend";

const TotalExpenditure: React.FC<{ cardId?: string }> = (props) => {
    const totalExpenditure = useGetTotalSpend(props.cardId || '');

    return (
        <Box>
            <Typography variant="h6" sx={{ color: 'blue' }}>
                Total Expenditure:
            </Typography>
            <Typography variant="h4" sx={{ color: 'blue' }}>{totalExpenditure}</Typography>
        </Box>
    )
}

export default TotalExpenditure;