import { IGoal } from 'CardStore';
import RepeatedGoal from './RepeatedGoal';
import SingleGoal from './SingleGoal';

const Goal: React.FC<IGoal & { cardId?: string }> = (props) => {

    if (props.metadata.goalMode === 'single-goal') {
        return (
            <SingleGoal {...props} />
        )
    } else {
        return (
            <RepeatedGoal {...props} />
        )
    }
}

export default Goal;