import { PLAYER } from '../config/balance';

/**
 * Coyote time e jump buffer, estratti in un modulo puro e aggiornati in ms:
 * il comportamento è indipendente dal frame rate (testato a 30/60/144 fps).
 * Semantica identica al legacy (r. 320-322, 331-332):
 *   - a terra il coyote si ricarica a 90ms, in aria decade;
 *   - alla pressione il buffer si carica a 130ms, poi decade;
 *   - il salto parte quando entrambi sono > 0, e li consuma entrambi.
 */
export class JumpTimers {
  coyote = 0;
  buffer = 0;

  update(dtMs: number, grounded: boolean, jumpJustPressed: boolean): void {
    if (grounded) this.coyote = PLAYER.coyoteMs;
    else this.coyote -= dtMs;
    if (jumpJustPressed) this.buffer = PLAYER.jumpBufferMs;
    else this.buffer -= dtMs;
  }

  get shouldJump(): boolean {
    return this.buffer > 0 && this.coyote > 0;
  }

  consume(): void {
    this.buffer = 0;
    this.coyote = 0;
  }
}
