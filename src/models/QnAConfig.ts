export const DefaultQnAConfig = {
    knowledgeBaseId: "<your-knowedge-base-id>",
    authEndpointKey: "<your-auth-endpoint-key>",
    qnaMakerServiceName: "<your-qna-maker-service-name>",
}

type QnAConfig = typeof DefaultQnAConfig

export type QnAConfigKey = keyof QnAConfig

export default QnAConfig