<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function balance(Request $request)
    {
        $wallet = $request->user()->wallet;

        return response()->json([
            'balance' => $wallet->balance,
        ]);
    }

    public function topup(Request $request)
    {
        $validated = $request->validate([
            'amount' => [
                'required',
                'integer',
                'min:1',
            ],
        ], [
            'amount.required' => 'The amount field is required.',
            'amount.integer' => 'The amount must be an integer.',
            'amount.min' => 'The amount must be greater than 0.',
        ]);

        $wallet = $request->user()->wallet;

        $wallet->increment('balance', $validated['amount']);

        $transaction = $request->user()->transactions()->create([
            'type' => 'topup',
            'amount' => $validated['amount'],
            'description' => 'Wallet top up',
        ]);

        return response()->json([
            'message' => 'Top-up successful.',
            'balance' => $wallet->fresh()->balance,
            'transaction' => $transaction,
        ]);
    }

    public function transactions(Request $request)
    {
        $transactions = $request->user()
            ->transactions()
            ->latest()
            ->get();

        return response()->json([
            'transactions' => $transactions,
        ]);
}
}
