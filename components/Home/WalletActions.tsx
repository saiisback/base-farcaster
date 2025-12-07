import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { parseEther } from 'viem'
import { base } from 'viem/chains'
import { useAppKit } from '@reown/appkit/react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from 'wagmi'

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { open } = useAppKit()

  async function sendTransactionHandler() {
    sendTransaction({
      to: '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7',
      value: parseEther('0.0001'),
    })
  }

  if (isConnected) {
    return (
      <div className="baseneko-card space-y-3 rounded-2xl border-4 border-[#5D4037] p-4 text-[#5D4037]">
        <h2 className="text-[11px] font-normal leading-none">wallet</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-[9px]">
            <p className="flex flex-col gap-1">
              <span className="text-[#6D4C41]">connected to wallet:</span>
              <span className="baseneko-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap bg-[#FFF8E1] px-2 py-1 font-mono text-[8px] text-[#3E2723]">
                {address}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#6D4C41]">chain id:</span>
              <span className="baseneko-pill bg-[#FFF8E1] px-2 py-1 text-[8px] text-[#3E2723]">
                {chainId}
              </span>
            </p>
            {chainId === base.id ? (
              <div className="mt-2 flex flex-col gap-2 rounded-xl border-2 border-dashed border-[#BCAAA4] bg-[#FFFDE7] p-3">
                <h3 className="text-[9px] font-normal text-[#5D4037]">
                  send transaction example
                </h3>
                <button
                  type="button"
                  className="rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none"
                  onClick={sendTransactionHandler}
                >
                  send 0.0001 eth
                </button>
                {hash && (
                  <button
                    type="button"
                    className="rounded-md bg-[#FFF8E1] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.4)] active:translate-y-0.5 active:shadow-none"
                    onClick={() =>
                      window.open(
                        `https://basescan.org/tx/${hash}`,
                        '_blank',
                      )
                    }
                  >
                    view on basescan
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="mt-2 rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none"
                onClick={() => switchChain({ chainId: base.id })}
              >
                switch to base
              </button>
            )}

            <button
              type="button"
              className="mt-2 rounded-md bg-[#FFF8E1] px-3 py-2 text-[9px] text-[#5D4037] shadow-[0_2px_0_0_rgba(93,64,55,0.4)] active:translate-y-0.5 active:shadow-none"
              onClick={() => disconnect()}
            >
              disconnect wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isEthProviderAvailable) {
    return (
      <div className="baseneko-card space-y-3 rounded-2xl border-4 border-[#5D4037] p-4 text-[#5D4037]">
        <h2 className="text-[11px] font-normal leading-none">wallet</h2>
        <div className="flex flex-row justify-start">
          <button
            type="button"
            className="w-full rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none"
            onClick={() => {
              if (isEthProviderAvailable) {
                // Inside Warpcast MiniApp: use the Farcaster connector
                connect({ connector: miniAppConnector() })
              } else {
                // On the web: open the WalletConnect/AppKit modal
                open?.()
              }
            }}
          >
            Connect Wallet (WalletConnect)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="baseneko-card space-y-2 rounded-2xl border-4 border-[#5D4037] p-4 text-[#5D4037]">
      <h2 className="text-[11px] font-normal leading-none">wallet</h2>
      <div className="flex flex-row justify-start">
        <p className="text-[9px] text-[#8D6E63]">wallet connection only via Warpcast mini app.</p>
      </div>
    </div>
  )
}
