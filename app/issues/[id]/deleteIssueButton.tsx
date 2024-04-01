"use client"

import { AlertDialog, Button, Flex, Spinner } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const DeleteIssueButton = ({ issueId }: { issueId: string }) => {
    const router = useRouter();
    const [error, setError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    return (
        <>
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <Button color='red'>Delete Issue</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
                    <AlertDialog.Description>
                        Are you sure you want to delete this issue?
                    </AlertDialog.Description>
                    <Flex mt="4" gap="3">
                        <AlertDialog.Cancel>
                            <Button variant='soft' color='gray'>Cancel</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button color='red' disabled={isDeleting} onClick={async () => {
                                try {
                                    setIsDeleting(true);
                                    await axios.delete('/api/issues/' + issueId);
                                    router.push('/issues');
                                    router.refresh();
                                } catch (error) {
                                    setIsDeleting(false);
                                    setError(true);
                                }
                            }}>Delete {isDeleting && <Spinner/>}</Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <AlertDialog.Root open={error}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Error</AlertDialog.Title>
                    <AlertDialog.Description>
                        An error occurred while deleting the issue
                    </AlertDialog.Description>
                    <AlertDialog.Action>
                        <Button mt="2" color="gray" variant='soft' onClick={() => setError(false)}>Close</Button>
                    </AlertDialog.Action>
                </AlertDialog.Content>
            </AlertDialog.Root >
        </>
    )
}

export default DeleteIssueButton