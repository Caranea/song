export interface MetadataEntry {
    header: string;
    title: string;
    titleUrl: string;
    subtitles: {
        name: string;
        url: string;
    }[];
    time: Date | undefined;
    products: string[];
    activityControls: string[];
    id: string;
    occurrenceCount: number;
    watchDatestamps: Date[] | undefined;
    metadata: {
        kind: string;
        etag: string;
        id: string;
        snippet: {
            publishedAt: string;
            channelId: string;
            title: string;
            description: string;
            thumbnails: {
                default: {
                    url: string;
                    width: number;
                    height: number;
                };
                medium: {
                    url: string;
                    width: number;
                    height: number;
                };
                high: {
                    url: string;
                    width: number;
                    height: number;
                };
                standard: {
                    url: string;
                    width: number;
                    height: number;
                };
                maxres: {
                    url: string;
                    width: number;
                    height: number;
                };
            };
            channelTitle: string;
            tags: string[];
            categoryId: string;
            liveBroadcastContent: string;
            localized: {
                title: string;
                description: string;
            };
        };
        topicDetails: {
            topicCategories: string[];
        };
    };
}