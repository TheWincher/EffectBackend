import { Context, Effect, Layer, pipe } from "effect";

class MyError extends Error {}

const success = Effect.succeed("Successs");
const fail = Effect.fail(new MyError());

const effect = pipe(
    success, 
    Effect.flatMap(val => val === 'Success' ? Effect.succeed(true) : fail), 
    Effect.catchAll(err => Effect.succeed(false))
);

console.log(Effect.runSync(effect));

interface IMySerice {
    hello: () => Effect.Effect<void>;
}

const MyService = Context.GenericTag<IMySerice>("MyService");

const myEffectService = Effect.flatMap(MyService, instance => instance.hello());

const layer = Layer.succeed(MyService, {hello: () => Effect.succeed(console.log("Hello"))});

const effect2 = pipe(myEffectService, Effect.provide(layer));

Effect.runSync(effect2);