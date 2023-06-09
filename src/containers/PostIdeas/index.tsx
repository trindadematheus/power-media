import { FormEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import CopyCard from '../../components/datadisplay/CopyCard'
import DotLoading from '../../components/feedback/DotLoading'
import BackButton from '../../components/inputs/BackButton'
import Button from '../../components/inputs/Button'
import TextInput from '../../components/inputs/TextInput'
import PageContainer from '../../components/layout/PageContainer'
import PageHeader from '../../components/layout/PageHeader'
import postIdeasPrompt from '../../prompts/post-ideas-prompt'
import { postSendMessageToChatGPT } from '../../services/chatgpt'
import * as S from './styles'

function PostIdeas() {
    const inputDescriptionRef = useRef<HTMLInputElement>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [ideas, setIdeas] = useState([])

    async function handleFetchEmojis(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const { data } = await postSendMessageToChatGPT({
                prompt: postIdeasPrompt(inputDescriptionRef.current.value)
            })

            setIdeas(JSON.parse(data.choices[0].text))
            inputDescriptionRef.current.value = ''
        } catch (error) {
            toast.error('Error. try again :(')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <PageContainer>
                <BackButton href='/' />

                <PageHeader
                    title='Post Ideas 💡'
                    description='Never run out of engaging content ideas with our dynamic post idea generator.'
                />

                <S.FormGroup onSubmit={handleFetchEmojis} >
                    <TextInput ref={inputDescriptionRef} placeholder='Type the theme' />
                    <Button disabled={isLoading} type='submit' className="btn-submit">
                        {isLoading ? <DotLoading /> : 'SEARCH'}
                    </Button>
                </S.FormGroup>

                <S.List>
                    {ideas.map((idea, key) => (
                        <CopyCard key={key} text={idea} />
                    ))}
                </S.List>
            </PageContainer>
        </>
    )
}

export default PostIdeas