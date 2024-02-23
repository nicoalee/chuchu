import { useMemo } from "react"
import { COMPANIES } from "../../constants"
import { Card, Image } from "@mantine/core";

function CardSummaryCompanyImage({ accountName }: { accountName: string }) {
    const company = useMemo(() => {
        return COMPANIES.find((company) => accountName.toLocaleLowerCase().includes(company.id.toLocaleLowerCase()))
    }, [accountName])

    return (
        <Card.Section>
            <Image height="140" src={company?.imageURL} />
        </Card.Section>
    )
}

export default CardSummaryCompanyImage