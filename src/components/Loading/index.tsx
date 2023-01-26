import React from 'react'
import { Container, LoadIndicator } from "./style";

export function Loading() {
    return (
        <>
            <Container>
                <LoadIndicator />
            </Container>
        </>
    )
}