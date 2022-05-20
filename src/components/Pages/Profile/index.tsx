import React, { useEffect, useState } from 'react';
import { useContext } from '../../ConnectKit';
import localizations from '../../../constants/localizations';
import { truncateEthAddress } from '../../../utils';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
  useNetwork,
} from 'wagmi';

import { AvatarContainer, AvatarInner, ChainSelectorContainer } from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Common/Modal/styles';
import Button from '../../Common/Button';
import Avatar from '../../Common/Avatar';
import ChainSelector from '../../ConnectModal/ChainSelector';

import { DisconnectIcon } from '../../../assets/icons';
import CopyToClipboard from '../../Common/CopyToClipboard';

const Profile: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].profileScreen;

  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const { activeChain } = useNetwork();
  const { data: balance } = useBalance({
    addressOrName: account?.address,
    //watch: true,
  });

  useEffect(() => {
    if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;
    // Close before disconnecting to avoid layout shifting while modal is still open
    context.setOpen(false);
    return () => {
      disconnect();
      reset();
    };
  }, [shouldDisconnect, disconnect, reset]);

  return (
    <PageContent>
      <ModalHeading>{copy.heading}</ModalHeading>
      <ModalContent style={{ paddingBottom: 22 }}>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              <ChainSelector />
            </ChainSelectorContainer>
            <Avatar address={account?.address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          <CopyToClipboard string={account?.address}>
            {ensName ? ensName : truncateEthAddress(account?.address)}
          </CopyToClipboard>
        </ModalH1>
        <ModalBody>
          {balance ? (
            <>
              {Number(balance?.formatted).toPrecision(3)}
              {` `}
              {balance?.symbol}
            </>
          ) : (
            <>&nbsp;</>
          )}
        </ModalBody>
      </ModalContent>
      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={<DisconnectIcon />}
      >
        Disconnect
      </Button>
    </PageContent>
  );
};

export default Profile;