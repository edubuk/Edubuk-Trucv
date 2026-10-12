import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia, sepolia } from "viem/chains";

const supportedNetworks = [
  {
    id: sepolia.id,
    name: "Ethereum Sepolia",
    description: "Ethereum test network",
    badge: "Ξ",
    color: "bg-[#627eea]",
  },
  {
    id: baseSepolia.id,
    name: "Base Sepolia",
    description: "Base test network",
    badge: "B",
    color: "bg-[#0052ff]",
  },
] as const;

const NetworkFirstConnectButton = () => {
  const [isNetworkPickerOpen, setIsNetworkPickerOpen] = useState(false);
  const [requestedChainId, setRequestedChainId] = useState<number | null>(null);
  const { status, chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    if (status !== "connected" || requestedChainId === null) return;

    if (chainId === requestedChainId) {
      setRequestedChainId(null);
      return;
    }

    void switchChainAsync({ chainId: requestedChainId })
      .then(() => setRequestedChainId(null))
      .catch(() => {
        toast.error("Please switch your wallet to the selected network");
        setRequestedChainId(null);
      });
  }, [chainId, requestedChainId, status, switchChainAsync]);

  if (status === "connected") {
    return <ConnectButton accountStatus="address" chainStatus="full" showBalance={false} />;
  }

  const chooseNetwork = (selectedChainId: number) => {
    setRequestedChainId(selectedChainId);
    setIsNetworkPickerOpen(false);

    if (!openConnectModal) {
      toast.error("Wallet connection is not ready. Please try again.");
      return;
    }

    openConnectModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsNetworkPickerOpen(true)}
        disabled={status === "connecting" || status === "reconnecting" || isSwitching}
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#03257e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#021d63] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "connecting" || status === "reconnecting" ? "Connecting..." : "Connect Wallet"}
      </button>

      {isNetworkPickerOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setIsNetworkPickerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-picker-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="network-picker-title" className="text-xl font-bold text-[#03257e]">
              Choose a network
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Select the network you want to use before connecting your wallet.
            </p>

            <div className="mt-5 grid gap-3">
              {supportedNetworks.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => chooseNetwork(network.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#03257e] hover:bg-blue-50"
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-bold text-white ${network.color}`}>
                    {network.badge}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900">{network.name}</span>
                    <span className="block text-xs text-slate-500">{network.description}</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsNetworkPickerOpen(false)}
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default NetworkFirstConnectButton;
