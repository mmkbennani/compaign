'use client';

import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { toast as sonner } from 'sonner';
import { message } from 'antd';

export function useContract(successCallback: () => void) {
  const { isConnected } = useAccount();
  const { data: writeContractHash, status: writeContractStatus, writeContract } = useWriteContract();
  const { status: transactionStatus } = useWaitForTransactionReceipt({
    hash: writeContractHash,
  });

  useEffect(() => {
    if (writeContractStatus === 'error' || transactionStatus === 'error') {
      message.error({
        content: 'Transaction failed!',
        duration: 2,
        style: {
          position: 'fixed',
          bottom: '10px',
          right: '10px',
        },
      });
    } else if (writeContractStatus === 'success' && transactionStatus === 'pending') {
      message.info({
        content: 'Transaction is being processed!',
        duration: 2,
        style: {
          position: 'fixed',
          bottom: '10px',
          right: '10px',
        },
      });
    } else if (transactionStatus === 'success') {
      message.success({
        content: 'Transaction has succeeded!',
        duration: 2,
        style: {
          position: 'fixed',
          bottom: '10px',
          right: '10px',
        },
      });
      successCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus, writeContractStatus]);

  return {
    isConnected: isConnected,
    isPending: transactionStatus === 'pending' && !['idle', 'error'].includes(writeContractStatus),
    writeContract,
  };
}
