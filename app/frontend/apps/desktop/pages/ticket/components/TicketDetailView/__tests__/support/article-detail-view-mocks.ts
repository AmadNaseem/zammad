// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { provideLocal } from '@vueuse/shared'
import { computed, ref, type ComputedRef, provide } from 'vue'

import { getQueryHandler } from '#tests/graphql/builders/__tests__/utils.ts'

import { TicketArticlesDocument } from '#shared/entities/ticket/graphql/queries/ticket/articles.api.ts'
import { createDummyArticle } from '#shared/entities/ticket-article/__tests__/mocks/ticket-articles.ts'
import { createDummyTicket } from '#shared/entities/ticket-article/__tests__/mocks/ticket.ts'
import type {
  TicketArticlesQuery,
  TicketArticlesQueryVariables,
} from '#shared/graphql/types.ts'

import { ARTICLES_INFORMATION_KEY } from '#desktop/pages/ticket/composables/useArticleContext.ts'
import { TICKET_KEY } from '#desktop/pages/ticket/composables/useTicketInformation.ts'

export const mockDetailViewSetup = (data?: {
  ticket?: Parameters<typeof createDummyTicket>[0]
  article?: Parameters<typeof createDummyArticle>[0]
}) => {
  const article = createDummyArticle(data?.article)

  const dummyTicket = createDummyTicket(data?.ticket)

  provideLocal(TICKET_KEY, {
    ticketInternalId: ref(dummyTicket.internalId),
    ticketId: computed(() => dummyTicket.id),
    ticket: computed(() => dummyTicket),
  })

  const handler = getQueryHandler<
    TicketArticlesQuery,
    TicketArticlesQueryVariables
  >(TicketArticlesDocument)

  provide(ARTICLES_INFORMATION_KEY, {
    articles: computed(() => ({
      firstArticles: [createDummyArticle(data?.article)],
      articles: [createDummyArticle(data?.article)], // :TODO create different data sets
    })) as unknown as ComputedRef<TicketArticlesQuery>,
    articlesQuery: handler,
  })

  return { article }
}