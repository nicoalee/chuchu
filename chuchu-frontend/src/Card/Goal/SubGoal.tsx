import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const SubGoal: React.FC<{ completed: boolean; status: 'PAST' | 'IN-PROGRESS' | 'FUTURE' }> = (props) => {
    if (props.status === 'PAST') {
        return (
            props.completed ? <CheckCircleIcon sx={{ color: 'success.dark' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
        )
    } else if (props.status === 'FUTURE') {
        return <AccessTimeFilledIcon sx={{ color: 'warning.dark' }} />
    } else {
        return props.completed ? <CheckCircleIcon sx={{ color: 'success.dark' }} /> : <MonetizationOnIcon sx={{ color: 'primary.main' }} />
    }
}

export default SubGoal