import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

function Loading({ isLoading, children }: { isLoading: boolean } & PropsWithChildren) {
    if (isLoading) {
        return (
            <Container>
                loading
            </Container>
        )
    }

    return children;
}

export default Loading;