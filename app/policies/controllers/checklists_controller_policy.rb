# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Controllers::ChecklistsControllerPolicy < Controllers::ApplicationControllerPolicy
  def create?
    update_access_via_ticket?
  end

  def update?
    update_access_via_ticket?
  end

  def destroy?
    update_access_via_ticket?
  end

  private

  def ticket_policy
    ticket = Checklist.lookup(id: record.params[:id])&.ticket || Ticket.lookup(id: record.params[:ticket_id])
    @ticket_policy ||= TicketPolicy.new(user, ticket)
  end

  def update_access_via_ticket?
    user.permissions?(['ticket.agent']) && ticket_policy.agent_update_access?
  end

  default_permit!(['ticket.agent'])
end
