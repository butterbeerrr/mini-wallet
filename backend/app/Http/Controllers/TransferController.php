<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransferController extends Controller
{
    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'recipient' => 'required|string',
            'amount' => [
                'required',
                'integer',
                'min:1',
            ],
        ], [
            'recipient.required' => 'The recipient field is required.',
            'amount.required'    => 'The amount field is required.',
            'amount.integer'     => 'The amount must be an integer.',
            'amount.min'         => 'The amount must be greater than 0.',
        ]);

        $sender = $request->user();

        $receiver = User::where('email', $validated['recipient'])->first();

        if (!$receiver) {
            return response()->json([
                'message' => 'Recipient not found.'
            ], 404);
        }

        if ($sender->id === $receiver->id) {
            return response()->json([
                'message' => 'You cannot transfer to yourself.'
            ], 400);
        }

        $senderWallet = $sender->wallet;
        $receiverWallet = $receiver->wallet;

        if (!$senderWallet || !$receiverWallet) {
            return response()->json([
                'message' => 'Wallet not found.'
            ], 400);
        }

        if ($senderWallet->balance < $validated['amount']) {
            return response()->json([
                'message' => 'Insufficient balance.'
            ], 400);
        }

        $amount = $validated['amount'];

        DB::transaction(function () use (
            $senderWallet,
            $receiverWallet,
            $sender,
            $receiver,
            $amount
        ) {
            $senderWallet->decrement('balance', $amount);

            $receiverWallet->increment('balance', $amount);

            $sender->transactions()->create([
                'type' => 'transfer_out',
                'amount' => $amount,
                'related_user_id' => $receiver->id,
                'description' => 'Transfer to ' . $receiver->username,
            ]);

            $receiver->transactions()->create([
                'type' => 'transfer_in',
                'amount' => $amount,
                'related_user_id' => $sender->id,
                'description' => 'Transfer from ' . $sender->username,
            ]);
        });

        return response()->json([
            'message' => 'Transfer successful.',
            'balance' => $senderWallet->fresh()->balance,
        ]);
    }
}
