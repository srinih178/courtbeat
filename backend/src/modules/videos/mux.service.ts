import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from '@mux/mux-node';

@Injectable()
export class MuxService {
  private mux: Mux;

  constructor(private configService: ConfigService) {
    const tokenId = this.configService.get('MUX_TOKEN_ID');
    const tokenSecret = this.configService.get('MUX_TOKEN_SECRET');

    if (tokenId && tokenSecret) {
      this.mux = new Mux({
        tokenId: tokenId,
        tokenSecret: tokenSecret,
      });
    } else {
      console.warn('⚠️  Mux credentials not configured. Video uploads will fail.');
    }
  }

  async createAsset(filePath: string): Promise<any> {
    if (!this.mux) {
      throw new Error('Mux not configured');
    }

    // Create direct upload URL
    const upload = await this.mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
    });

    // In production, you'd upload the file to the upload URL
    // For POC, we create asset directly with a placeholder
    const asset = await this.mux.video.assets.create({
      input: [{url: upload.url}],
      playback_policy: ['public'],
      mp4_support: 'standard',
    });

    return asset;
  }

  async getAsset(assetId: string): Promise<any> {
    if (!this.mux) {
      throw new Error('Mux not configured');
    }

    return this.mux.video.assets.retrieve(assetId);
  }

  async deleteAsset(assetId: string): Promise<void> {
    if (!this.mux) {
      return;
    }

    await this.mux.video.assets.delete(assetId);
  }

  async createPlaybackId(assetId: string): Promise<string> {
    if (!this.mux) {
      throw new Error('Mux not configured');
    }

    const playbackId = await this.mux.video.assets.createPlaybackId(assetId, {
      policy: 'public',
    });

    return playbackId.id;
  }
}
