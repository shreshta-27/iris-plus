import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme.dart';
import 'package:flutter_animate/flutter_animate.dart';

class LiveRoutingFeed extends StatelessWidget {
  final List<Map<String, dynamic>> events;
  final bool isConnected;

  const LiveRoutingFeed({
    super.key,
    required this.events,
    required this.isConnected,
  });

  Color _getTierColor(String? tier) {
    if (tier == null) return IrisColors.mint;
    final lower = tier.toLowerCase();
    if (lower.contains('haiku')) return IrisColors.sunny;
    if (lower.contains('sonnet')) return IrisColors.coral;
    return IrisColors.mint;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: IrisColors.white,
        border: const Border(
          bottom: BorderSide(color: IrisColors.ink, width: 4),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: IrisColors.sky,
                        border: Border.all(color: IrisColors.ink, width: 2),
                        borderRadius: IrisRadius.small,
                        boxShadow: IrisShadows.neo(x: 2, y: 2),
                      ),
                      child: Text(
                        'LIVE',
                        style: GoogleFonts.spaceGrotesk(
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                          color: IrisColors.ink,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'ROUTING FEED',
                      style: GoogleFonts.spaceGrotesk(
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                        letterSpacing: 1.5,
                        color: IrisColors.ink,
                      ),
                    ),
                  ],
                ),
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isConnected ? IrisColors.mint : IrisColors.coral,
                    border: Border.all(color: IrisColors.ink, width: 2),
                    boxShadow: IrisShadows.neo(x: 2, y: 2),
                  ),
                ).animate(
                  onPlay: (controller) => isConnected ? controller.repeat(reverse: true) : controller.stop(),
                ).scaleXY(begin: 1.0, end: 1.3, duration: 1.seconds),
              ],
            ),
          ),
          Container(
            height: 4,
            color: IrisColors.ink,
          ),
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 300),
            child: events.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: IrisColors.ink.withValues(alpha: 0.2),
                                width: 4,
                              ),
                            ),
                            child: Icon(
                              Icons.timeline,
                              size: 32,
                              color: IrisColors.ink.withValues(alpha: 0.4),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'WAITING FOR QUERIES...',
                            style: GoogleFonts.spaceGrotesk(
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                              letterSpacing: 1.5,
                              color: IrisColors.ink.withValues(alpha: 0.4),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(16),
                    itemCount: events.length,
                    itemBuilder: (context, index) {
                      final event = events[index];
                      return _buildEventItem(event);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventItem(Map<String, dynamic> event) {
    final type = event['type'];
    final time = event['timestamp'] != null 
        ? DateFormat('HH:mm:ss').format(DateTime.parse(event['timestamp']).toLocal())
        : DateFormat('HH:mm:ss').format(DateTime.now());

    if (type == 'injection_blocked') {
      return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: IrisColors.coral.withValues(alpha: 0.1),
            border: Border.all(color: IrisColors.coral, width: 3),
            borderRadius: IrisRadius.medium,
            boxShadow: [
              BoxShadow(
                color: IrisColors.coral,
                offset: const Offset(4, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.security, color: IrisColors.coral, size: 16),
                      const SizedBox(width: 8),
                      Text(
                        'PIGUARD BLOCKED',
                        style: GoogleFonts.spaceGrotesk(
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                          letterSpacing: 1.5,
                          color: IrisColors.coral,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'Cost: \$0.00',
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w900,
                      fontSize: 10,
                      color: IrisColors.coral,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '"${event['message'] ?? event['promptExcerpt'] ?? 'Unknown prompt'}"',
                style: GoogleFonts.spaceGrotesk(
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                  color: IrisColors.ink.withValues(alpha: 0.7),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ).animate().fadeIn().slideY(begin: 0.1),
      );
    }

    if (type == 'routing_step') {
      final step = event['step'] as int? ?? 1;
      IconData icon;
      if (step == 1) { icon = Icons.timeline; }
      else if (step == 2) { icon = Icons.psychology; }
      else if (step == 3) { icon = Icons.route; }
      else if (step == 4) { icon = Icons.psychology; }
      else if (step == 5) { icon = Icons.cached; }
      else if (step == 6) { icon = Icons.security; }
      else { icon = Icons.timeline; }
      
      final isDone = event['status'] == 'done';

      return Padding(
        padding: const EdgeInsets.only(left: 24, bottom: 8, top: 8),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              left: -11,
              top: -8,
              bottom: -8,
              child: Container(
                width: 2,
                color: IrisColors.ink.withValues(alpha: 0.2),
              ),
            ),
            Positioned(
              left: -18,
              top: 12,
              child: Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: IrisColors.cream,
                  border: Border.all(color: IrisColors.ink, width: 2),
                  shape: BoxShape.circle,
                  boxShadow: IrisShadows.neo(x: 2, y: 2),
                ),
                child: Center(
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isDone ? IrisColors.mint : IrisColors.sunny,
                      shape: BoxShape.circle,
                    ),
                  ).animate(
                    onPlay: (controller) => !isDone ? controller.repeat(reverse: true) : controller.stop(),
                  ).fade(duration: 500.ms),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: IrisColors.white,
                border: Border.all(color: IrisColors.ink, width: 2),
                borderRadius: IrisRadius.small,
                boxShadow: IrisShadows.neo(x: 2, y: 2),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(icon, size: 16, color: IrisColors.ink.withValues(alpha: 0.6)),
                  const SizedBox(width: 8),
                  Text(
                    event['message'] ?? 'Routing Step',
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                      color: IrisColors.ink,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ).animate().fadeIn().slideX(begin: -0.1),
      );
    }

    final modelDisplayName = event['modelDisplayName'] ?? event['tier'] ?? 'AI';
    final costSavings = event['costSavings']?['savedPercent'] ?? 0;
    
    // Parse cost properly based on the frontend logic
    num costVal = 0;
    if (event['cost'] != null) {
      if (event['cost'] is Map) {
         costVal = num.tryParse(event['cost']['thisCallFormatted']?.toString().replaceAll('\$', '') ?? '0') ?? 0;
      } else {
         costVal = num.tryParse(event['cost']?.toString().replaceAll('\$', '') ?? '0') ?? 0;
      }
    }
    final String formattedCost = '\$${costVal.toStringAsFixed(4)}';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12, top: 8),
      child: Container(
        decoration: BoxDecoration(
          color: IrisColors.white,
          border: Border.all(color: IrisColors.ink, width: 3),
          borderRadius: IrisRadius.medium,
          boxShadow: IrisShadows.neo(x: 4, y: 4),
        ),
        child: Stack(
          children: [
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              width: 12,
              child: Container(
                decoration: BoxDecoration(
                  color: _getTierColor(modelDisplayName),
                  border: const Border(
                    right: BorderSide(color: IrisColors.ink, width: 3),
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(13),
                    bottomLeft: Radius.circular(13),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 24, top: 12, right: 12, bottom: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        time,
                        style: GoogleFonts.spaceGrotesk(
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                          letterSpacing: 1.5,
                          color: IrisColors.ink.withValues(alpha: 0.5),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: IrisColors.cream,
                          border: Border.all(color: IrisColors.ink, width: 2),
                          borderRadius: IrisRadius.small,
                        ),
                        child: Text(
                          formattedCost,
                          style: GoogleFonts.jetBrainsMono(
                            fontWeight: FontWeight.w900,
                            fontSize: 10,
                            color: IrisColors.ink,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '"${event['promptExcerpt'] ?? 'Processed Query'}"',
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: IrisColors.ink,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Container(
                    height: 2,
                    color: IrisColors.ink.withValues(alpha: 0.1),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getTierColor(modelDisplayName),
                          border: Border.all(color: IrisColors.ink, width: 2),
                          borderRadius: IrisRadius.small,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.psychology, size: 12, color: IrisColors.ink),
                            const SizedBox(width: 4),
                            Text(
                              modelDisplayName.toUpperCase(),
                              style: GoogleFonts.spaceGrotesk(
                                fontWeight: FontWeight.w900,
                                fontSize: 10,
                                letterSpacing: 1.5,
                                color: IrisColors.ink,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: IrisColors.cream,
                          borderRadius: IrisRadius.small,
                        ),
                        child: Text(
                          event['reason'] ?? 'Default routing applied',
                          style: GoogleFonts.spaceGrotesk(
                            fontWeight: FontWeight.w700,
                            fontSize: 10,
                            color: IrisColors.ink.withValues(alpha: 0.7),
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (costSavings > 0) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: IrisColors.mint.withValues(alpha: 0.1),
                        border: Border.all(color: IrisColors.mint, width: 2),
                        borderRadius: IrisRadius.small,
                      ),
                      child: Text(
                        'Saved $costSavings% vs Sonnet 4.6',
                        style: GoogleFonts.spaceGrotesk(
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                          color: IrisColors.mint,
                        ),
                      ),
                    ),
                  ]
                ],
              ),
            ),
          ],
        ),
      ).animate().fadeIn().slideY(begin: 0.1),
    );
  }
}
