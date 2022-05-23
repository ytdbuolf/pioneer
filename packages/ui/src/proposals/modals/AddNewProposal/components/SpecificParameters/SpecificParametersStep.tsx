import { u32 } from '@polkadot/types'
import React from 'react'
import { State, Typestate } from 'xstate'

import { ValidationHelpers } from '@/common/utils/validation'
import { DecreaseWorkingGroupLeadStake } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/DecreaseWorkingGroupLeadStake'
import { FundingRequest } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/FundingRequest'
import { RuntimeUpgrade } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/RuntimeUpgrade'
import { SetCouncilBudgetIncrement } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetCouncilBudgetIncrement'
import { SetCouncilorReward } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetCouncilorReward'
import {
  MAX_VALIDATOR_COUNT,
  SetMaxValidatorCount,
} from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetMaxValidatorCount'
import { SetMembershipLeadInvitationQuota } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetMembershipLeadInvitationQuota'
import { SetMembershipPrice } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetMembershipPrice'
import { SetReferralCut } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetReferralCut'
import { SetWorkingGroupLeadReward } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SetWorkingGroupLeadReward'
import { Signal } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/Signal'
import { SlashWorkingGroupLead } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/SlashWorkingGroupLead'
import { TerminateWorkingGroupLead } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/TerminateWorkingGroupLead'
import { UpdateWorkingGroupBudget } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/UpdateWorkingGroupBudget'
import { CancelWorkingGroupLeadOpening } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/WorkingGroupLeadOpening/CancelWorkingGroupLeadOpening'
import {
  ApplicationForm,
  DurationAndProcess,
  StakingPolicyAndReward,
  WorkingGroupAndDescription,
} from '@/proposals/modals/AddNewProposal/components/SpecificParameters/WorkingGroupLeadOpening/CreateWorkingGroupLeadOpening'
import { FillWorkingGroupLeadOpening } from '@/proposals/modals/AddNewProposal/components/SpecificParameters/WorkingGroupLeadOpening/FillWorkingGroupLeadOpening'
import {
  AddNewProposalContext,
  AddNewProposalEvent,
  AddNewProposalMachineState,
} from '@/proposals/modals/AddNewProposal/machine'

import { SetInitialInvitationBalance } from './SetInitialInvitationBalance'
import { SetInitialInvitationCount } from './SetInitialInvitationCount'

export interface ExecutionProps {
  setIsExecutionError: (value: boolean) => void
}

interface SpecificParametersStepProps extends ExecutionProps, ValidationHelpers {
  send: (event: AddNewProposalEvent['type'], payload: any) => void
  state: State<AddNewProposalContext, AddNewProposalEvent, any, Typestate<AddNewProposalContext>>
}

export const isValidSpecificParameters = (state: AddNewProposalMachineState, minimumValidatorCount?: u32): boolean => {
  const specifics = state.context.specifics

  switch (true) {
    case state.matches('specificParameters.runtimeUpgrade'): {
      return !!specifics?.runtime && specifics.runtime.byteLength !== 0
    }
    case state.matches('specificParameters.setMaxValidatorCount'): {
      return !!(
        specifics?.amount &&
        specifics.amount.ltn(MAX_VALIDATOR_COUNT) &&
        specifics.amount.gtn(minimumValidatorCount?.toNumber() || 0)
      )
    }
    case state.matches('specificParameters.setCouncilBudgetIncrement'): {
      return !!(specifics?.amount && specifics.amount.gtn(0))
    }
    case state.matches('specificParameters.setReferralCut'): {
      return typeof specifics?.referralCut === 'number' && specifics.referralCut < 101
    }
    case state.matches('specificParameters.updateWorkingGroupBudget'): {
      return !!(
        specifics?.groupId &&
        specifics?.budgetUpdate &&
        specifics.budgetUpdate.gtn(0) &&
        specifics.budgetUpdateKind
      )
    }
    case state.matches('specificParameters.setMembershipLeadInvitationQuota'): {
      return !!(specifics?.amount && specifics.amount.gtn(0))
    }
    case state.matches('specificParameters.setInitialInvitationBalance'): {
      return !!(specifics?.amount && specifics?.amount.gtn(0))
    }
    case state.matches('specificParameters.setMembershipPrice'): {
      return !!(specifics?.amount && specifics?.amount.gtn(0))
    }
    case state.matches('specificParameters.setInitialInvitationCount'): {
      return !!specifics?.invitationCount
    }
    default:
      return false
  }
}

export const SpecificParametersStep = ({
  send,
  state,
  setIsExecutionError,
  ...validationHelpers
}: SpecificParametersStepProps) => {
  switch (true) {
    case state.matches('specificParameters.signal'):
      return <Signal />
    case state.matches('specificParameters.fundingRequest'):
      return <FundingRequest />
    case state.matches('specificParameters.runtimeUpgrade'):
      return <RuntimeUpgrade />
    case state.matches('specificParameters.setCouncilorReward'):
      return <SetCouncilorReward />
    case state.matches('specificParameters.setCouncilBudgetIncrement'):
      return <SetCouncilBudgetIncrement />
    case state.matches('specificParameters.fillWorkingGroupLeadOpening'): {
      return <FillWorkingGroupLeadOpening />
    }
    case state.matches('specificParameters.createWorkingGroupLeadOpening.workingGroupAndDescription'):
      return <WorkingGroupAndDescription {...validationHelpers} />
    case state.matches('specificParameters.createWorkingGroupLeadOpening.durationAndProcess'):
      return <DurationAndProcess />
    case state.matches('specificParameters.createWorkingGroupLeadOpening.applicationForm'):
      return <ApplicationForm />
    case state.matches('specificParameters.cancelWorkingGroupLeadOpening'):
      return <CancelWorkingGroupLeadOpening />
    case state.matches('specificParameters.createWorkingGroupLeadOpening.stakingPolicyAndReward'):
      return <StakingPolicyAndReward {...validationHelpers} />
    case state.matches('specificParameters.decreaseWorkingGroupLeadStake'):
      return <DecreaseWorkingGroupLeadStake />
    case state.matches('specificParameters.slashWorkingGroupLead'):
      return <SlashWorkingGroupLead />
    case state.matches('specificParameters.terminateWorkingGroupLead'):
      return <TerminateWorkingGroupLead />
    case state.matches('specificParameters.setWorkingGroupLeadReward'):
      return <SetWorkingGroupLeadReward />
    case state.matches('specificParameters.updateWorkingGroupBudget'):
      return (
        <UpdateWorkingGroupBudget
          setBudgetUpdate={(amount) => send('SET_BUDGET_UPDATE', { amount })}
          setBudgetUpdateKind={(kind) => send('SET_BUDGET_UPDATE_KIND', { kind })}
          budgetUpdate={state.context.specifics?.budgetUpdate}
          groupId={state.context.specifics?.groupId}
          setGroupId={(groupId) => send('SET_WORKING_GROUP', { groupId })}
        />
      )
    case state.matches('specificParameters.setInitialInvitationCount'):
      return (
        <SetInitialInvitationCount
          setNewCount={(count) => send('SET_INVITATION_COUNT', { count })}
          invitationCount={state.context.specifics?.invitationCount}
        />
      )
    case state.matches('specificParameters.setReferralCut'): {
      return (
        <SetReferralCut
          setReferralCut={(referralCut) => send('SET_REFERRAL_CUT', { referralCut })}
          referralCut={state.context.specifics?.referralCut}
          setIsExecutionError={setIsExecutionError}
        />
      )
    }
    case state.matches('specificParameters.setMembershipLeadInvitationQuota'):
      return (
        <SetMembershipLeadInvitationQuota
          amount={state.context.specifics?.amount}
          setAmount={(amount) => send('SET_AMOUNT', { amount })}
        />
      )
    case state.matches('specificParameters.setInitialInvitationBalance'): {
      return (
        <SetInitialInvitationBalance
          setAmount={(amount) => send('SET_AMOUNT', { amount })}
          amount={state.context.specifics?.amount}
        />
      )
    }
    case state.matches('specificParameters.setMaxValidatorCount'):
      return (
        <SetMaxValidatorCount
          setValidatorCount={(amount) => send('SET_AMOUNT', { amount })}
          validatorCount={state.context.specifics?.amount}
        />
      )
    case state.matches('specificParameters.setMembershipPrice'): {
      return (
        <SetMembershipPrice
          setAmount={(amount) => send('SET_AMOUNT', { amount })}
          amount={state.context.specifics?.amount}
        />
      )
    }
    default:
      return null
  }
}
